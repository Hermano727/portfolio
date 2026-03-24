"use client"

/**
 * SceneManager — Three.js WebGL background + post-processing
 *
 * Fixed full-viewport canvas, z-index 0, pointer-events none.
 * Phase progression driven by scrollProgress (0–1):
 *   Space      0.00 – 0.30  glowing filament constellation + parallax starfield
 *   Atmosphere 0.30 – 0.70  wispy cloud particles, deep blue → sky blue
 *   Earth      0.70 – 1.00  warm amber haze, sky blue → dark terracotta
 *
 * Camera transitions:
 *   Space  (0.00–0.30): Wide Exosphere — z=10, fov=60, mouse-driven tilt
 *   Scroll (0.30–0.70): Transition    — z→8,  fov→46, y→-1.8
 *   Earth  (0.70–1.00): Vertical Ladder — z=8, fov=46, y=-1.8
 *
 * Exports `getPhaseFromScroll` as a pure function for unit tests (ISSUE-013).
 */

import { useEffect, useRef, useMemo, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScenePhase = "space" | "atmosphere" | "earth"

export interface SceneManagerProps {
  scrollProgress?: number
  /** Normalized mouse coords: x/y each in [-1, 1] */
  mousePosition?: { x: number; y: number }
  /** Called when the computed phase changes */
  onPhaseChange?: (phase: ScenePhase) => void
  /**
   * "hero" → normal exosphere state.
   * "deck" → fired at hero-exit t=0; clamps effectiveProgress to ≥0.32 so the
   *           camera/background lerp toward atmosphere during the 820 ms dive window,
   *           even before the user has scrolled at all.
   */
  scenePhase?: "hero" | "deck"
}

// ─── Pure helpers (exportable for unit tests) ─────────────────────────────────

/** Maps scrollProgress → ScenePhase. No side effects. */
export function getPhaseFromScroll(scrollProgress: number): ScenePhase {
  if (scrollProgress < 0.3) return "space"
  if (scrollProgress < 0.7) return "atmosphere"
  return "earth"
}

// ─── WebGL detection ──────────────────────────────────────────────────────────

function hasWebGL(): boolean {
  if (typeof window === "undefined") return false
  try {
    const canvas = document.createElement("canvas")
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    )
  } catch {
    return false
  }
}

// ─── Phase background colours ─────────────────────────────────────────────────

const BG_SPACE      = new THREE.Color(0x010714)
const BG_ATMOSPHERE = new THREE.Color(0x0e3d78)
const BG_EARTH      = new THREE.Color(0x1c0a05)

function BackgroundColor({ scrollProgress }: { scrollProgress: number }) {
  const { gl } = useThree()
  const currentColor = useRef(BG_SPACE.clone())

  useFrame(() => {
    const phase = getPhaseFromScroll(scrollProgress)
    const target =
      phase === "space" ? BG_SPACE
      : phase === "atmosphere" ? BG_ATMOSPHERE
      : BG_EARTH
    currentColor.current.lerp(target, 0.025)
    gl.setClearColor(currentColor.current, 1)
  })

  return null
}

// ─── Camera Rig — parallax tilt + scroll-based Wide Exosphere → Vertical Ladder ─

interface CameraRigProps {
  scrollProgress: number
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  /** When true, lunges the camera forward +500 units into the constellation. */
  cardExpanded: boolean
}

function CameraRig({ scrollProgress, mouseRef, cardExpanded }: CameraRigProps) {
  const { camera } = useThree()
  // Tracks the live lunge offset so it springs smoothly in/out.
  const zLungeRef = useRef(0)

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera
    const mx  = mouseRef.current.x
    const my  = mouseRef.current.y

    // Normalized transition progress: 0 (full space) → 1 (full earth)
    const t = Math.min(1, Math.max(0, scrollProgress / 0.7))

    // Wide Exosphere → Vertical Ladder camera motion
    const baseZ     = THREE.MathUtils.lerp(10, 8,    t)
    const targetY   = THREE.MathUtils.lerp(0,  -1.8, t)
    const targetFov = THREE.MathUtils.lerp(60, 46,   t)

    // Z-Lunge: on card expand, spring the camera forward by 5 units (≈ 500
    // world-unit dive feel scaled to the scene's compact coordinate space).
    // Uses a fast lerp factor (0.08) for a punchy Power4-ish deceleration.
    const lungeTarget = cardExpanded ? -5 : 0
    zLungeRef.current += (lungeTarget - zLungeRef.current) * 0.08
    const targetZ = baseZ + zLungeRef.current

    // Mouse parallax tilt — fades out as we leave the space phase
    const tiltFactor = Math.max(0, 1 - scrollProgress / 0.25)
    const targetRX   = -my * 0.055 * tiltFactor
    const targetRY   =  mx * 0.055 * tiltFactor

    // Smooth lerp toward targets
    cam.position.z += (targetZ - cam.position.z) * 0.05
    cam.position.y += (targetY - cam.position.y) * 0.05
    cam.fov        += (targetFov - cam.fov)       * 0.05
    cam.updateProjectionMatrix()

    cam.rotation.x += (targetRX - cam.rotation.x) * 0.04
    cam.rotation.y += (targetRY - cam.rotation.y) * 0.04
  })

  return null
}

// ─── Filament Constellation ───────────────────────────────────────────────────
//
// Each node drifts slowly AND is attracted toward the cursor.
// Nearby node pairs are connected by glowing filament lines.
// The cursor also draws explicit lines to all nodes within CURSOR_LINE_DIST,
// replicating the original 2D constellation's "connect to mouse" behaviour.
// The whole group tilts with the mouse for 3-D parallax.

const FILAMENT_NODE_COUNT = 52
const FILAMENT_MAX_DIST   = 3.8
const FILAMENT_MAX_PAIRS  = 280

// Node-to-cursor physics — repulsion model with spring return
const REPEL_RADIUS   = 4.4    // world units — cursor pushes nodes within this range
const REPEL_STRENGTH = 0.095  // impulse per frame at contact (falls off linearly to edge)
const SPRING_K       = 0.010  // Hooke stiffness toward origin — soft enough for fluid drift
const DAMPING        = 0.93   // velocity multiplier per frame — higher = floatier recovery
const CURSOR_LINE_DIST = 5.8  // world units — draw explicit lines within this range

interface FilamentNode {
  x: number; y: number; z: number
  ox: number; oy: number        // resting / origin position
  vx: number; vy: number        // velocity (px per frame in world-units)
}

interface FilamentConstellationProps {
  scrollProgress: number
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

function FilamentConstellation({ scrollProgress, mouseRef }: FilamentConstellationProps) {
  const { size, camera }  = useThree()
  const groupRef          = useRef<THREE.Group>(null)
  const linesRef          = useRef<THREE.LineSegments>(null)
  const pointsRef         = useRef<THREE.Points>(null)
  const cursorLinesRef    = useRef<THREE.LineSegments>(null)

  // Pre-allocated cursor world→local vector (avoids per-frame allocation)
  const _cursorVec = useMemo(() => new THREE.Vector3(), [])

  const nodes = useMemo<FilamentNode[]>(
    () =>
      Array.from({ length: FILAMENT_NODE_COUNT }, () => {
        const x = (Math.random() - 0.5) * 22
        const y = (Math.random() - 0.5) * 13
        return {
          x, y,
          z:  (Math.random() - 0.5) * 2.5,
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * 0.014,   // gentle seed velocity for organic idle drift
          vy: (Math.random() - 0.5) * 0.010,
        }
      }),
    []
  )

  const linesGeo = useMemo(() => {
    const geo     = new THREE.BufferGeometry()
    const pos     = new Float32Array(FILAMENT_MAX_PAIRS * 6)
    const col     = new Float32Array(FILAMENT_MAX_PAIRS * 6)
    const posAttr = new THREE.BufferAttribute(pos, 3)
    const colAttr = new THREE.BufferAttribute(col, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    colAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute("position", posAttr)
    geo.setAttribute("color",    colAttr)
    geo.setDrawRange(0, 0)
    return geo
  }, [])

  // Cursor-to-node lines: one buffer slot per node (max FILAMENT_NODE_COUNT lines)
  const cursorLinesGeo = useMemo(() => {
    const geo     = new THREE.BufferGeometry()
    const pos     = new Float32Array(FILAMENT_NODE_COUNT * 6)
    const col     = new Float32Array(FILAMENT_NODE_COUNT * 6)
    const posAttr = new THREE.BufferAttribute(pos, 3)
    const colAttr = new THREE.BufferAttribute(col, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    colAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute("position", posAttr)
    geo.setAttribute("color",    colAttr)
    geo.setDrawRange(0, 0)
    return geo
  }, [])

  const pointsGeo = useMemo(() => {
    const geo     = new THREE.BufferGeometry()
    const pos     = new Float32Array(FILAMENT_NODE_COUNT * 3)
    const col     = new Float32Array(FILAMENT_NODE_COUNT * 3)
    for (let i = 0; i < FILAMENT_NODE_COUNT; i++) {
      pos[i * 3] = nodes[i].x; pos[i * 3 + 1] = nodes[i].y; pos[i * 3 + 2] = nodes[i].z
      col[i * 3] = 0.82;       col[i * 3 + 1] = 0.38;       col[i * 3 + 2] = 1.0
    }
    const posAttr = new THREE.BufferAttribute(pos, 3)
    posAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute("position", posAttr)
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3))
    return geo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(() => {
    if (!groupRef.current || !linesRef.current || !pointsRef.current || !cursorLinesRef.current) return

    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    // ── Group parallax tilt (increased sensitivity vs. previous 0.10) ──
    const gRef = groupRef.current
    gRef.rotation.x += (-my * 0.18 - gRef.rotation.x) * 0.04
    gRef.rotation.y += ( mx * 0.18 - gRef.rotation.y) * 0.04

    // ── Cursor world position → group local space ──
    // Uses the live camera fov so it stays accurate during the scroll transition.
    const cam   = camera as THREE.PerspectiveCamera
    const halfH = cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const halfW = halfH * (size.width / size.height)
    _cursorVec.set(mx * halfW, my * halfH, 0)
    gRef.worldToLocal(_cursorVec)
    const lcx = _cursorVec.x
    const lcy = _cursorVec.y

    // ── Repulsion + spring-damper physics ──
    // Cursor disturbs nearby nodes outward; spring quietly returns each node
    // to its origin when the mouse is away — no clumping, no chasing.
    for (const n of nodes) {
      // 1. Cursor repulsion — push away from cursor
      const rdx   = n.x - lcx
      const rdy   = n.y - lcy
      const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
      if (rdist < REPEL_RADIUS && rdist > 0.05) {
        const push = (1 - rdist / REPEL_RADIUS) * REPEL_STRENGTH
        n.vx += (rdx / rdist) * push
        n.vy += (rdy / rdist) * push
      }

      // 2. Hooke's law spring toward origin — smooth, no overshoot bounce
      n.vx += (n.ox - n.x) * SPRING_K
      n.vy += (n.oy - n.y) * SPRING_K

      // 3. Velocity damping — exponential decay gives fluid "returning" feel
      n.vx *= DAMPING
      n.vy *= DAMPING

      // 4. Integrate position
      n.x += n.vx
      n.y += n.vy
    }

    // ── Update node point geometry ──
    const ptPos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < nodes.length; i++) ptPos.setXYZ(i, nodes[i].x, nodes[i].y, nodes[i].z)
    ptPos.needsUpdate = true

    // ── Rebuild node-to-node filament lines ──
    const lPos    = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
    const lCol    = linesRef.current.geometry.attributes.color    as THREE.BufferAttribute
    const lPosArr = lPos.array as Float32Array
    const lColArr = lCol.array as Float32Array
    let count = 0
    outer: for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (count >= FILAMENT_MAX_PAIRS) break outer
        const a = nodes[i], b = nodes[j]
        const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < FILAMENT_MAX_DIST) {
          const s    = 1 - dist / FILAMENT_MAX_DIST
          const base = count * 6
          lPosArr[base]     = a.x; lPosArr[base + 1] = a.y; lPosArr[base + 2] = a.z
          lPosArr[base + 3] = b.x; lPosArr[base + 4] = b.y; lPosArr[base + 5] = b.z
          const r = 0.72 * s + 0.08, g = 0.28 * s, bv = s
          lColArr[base]     = r;  lColArr[base + 1] = g;  lColArr[base + 2] = bv
          lColArr[base + 3] = r;  lColArr[base + 4] = g;  lColArr[base + 5] = bv
          count++
        }
      }
    }
    linesRef.current.geometry.setDrawRange(0, count * 2)
    lPos.needsUpdate = true
    lCol.needsUpdate = true

    // ── Cursor-to-node lines (explicit lines drawn from cursor to nearby nodes) ──
    const clPos    = cursorLinesRef.current.geometry.attributes.position as THREE.BufferAttribute
    const clCol    = cursorLinesRef.current.geometry.attributes.color    as THREE.BufferAttribute
    const clPosArr = clPos.array as Float32Array
    const clColArr = clCol.array as Float32Array
    let cCount = 0
    for (const n of nodes) {
      if (cCount >= FILAMENT_NODE_COUNT) break
      const dx   = lcx - n.x
      const dy   = lcy - n.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < CURSOR_LINE_DIST) {
        const a    = (1 - dist / CURSOR_LINE_DIST) * 0.88
        const base = cCount * 6
        // Line from cursor position → node
        clPosArr[base]     = lcx; clPosArr[base + 1] = lcy; clPosArr[base + 2] = 0
        clPosArr[base + 3] = n.x; clPosArr[base + 4] = n.y; clPosArr[base + 5] = n.z
        // Brighter, more saturated purple-white so cursor lines pop
        clColArr[base]     = 0.95 * a; clColArr[base + 1] = 0.55 * a; clColArr[base + 2] = a
        clColArr[base + 3] = 0.95 * a; clColArr[base + 4] = 0.55 * a; clColArr[base + 5] = a
        cCount++
      }
    }
    cursorLinesRef.current.geometry.setDrawRange(0, cCount * 2)
    clPos.needsUpdate = true
    clCol.needsUpdate = true
  })

  const opacity =
    scrollProgress < 0.18 ? 1
    : scrollProgress > 0.35 ? 0
    : 1 - (scrollProgress - 0.18) / (0.35 - 0.18)

  if (opacity <= 0) return null

  return (
    <group ref={groupRef}>
      {/* Node-to-node filament lines */}
      <lineSegments ref={linesRef} geometry={linesGeo}>
        <lineBasicMaterial vertexColors transparent opacity={opacity}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {/* Cursor-to-node lines */}
      <lineSegments ref={cursorLinesRef} geometry={cursorLinesGeo}>
        <lineBasicMaterial vertexColors transparent opacity={opacity}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {/* Node points */}
      <points ref={pointsRef} geometry={pointsGeo}>
        <pointsMaterial size={2.0} vertexColors transparent opacity={opacity * 0.88}
          blending={THREE.AdditiveBlending} sizeAttenuation={false} depthWrite={false} />
      </points>
    </group>
  )
}

// ─── Space Phase — multi-layer parallax starfield ─────────────────────────────

const SPACE_FADE_START = 0.22
const SPACE_FADE_END   = 0.38

// Stars are purely static — no cursor interaction. Only the filament nodes
// respond to the mouse, making the cursor feel like it's "pulling" the web.
interface StarLayerProps {
  count:    number
  spread:   number
  baseSize: number
  tint:     [r: number, g: number, b: number]
  opacity:  number
}

function StarLayer({ count, spread, baseSize, tint, opacity }: StarLayerProps) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3]     = (Math.random() - 0.5) * spread
      pos[i3 + 1] = (Math.random() - 0.5) * spread * 0.6
      pos[i3 + 2] = (Math.random() - 0.5) * 4

      const b = 0.35 + Math.random() * 0.65
      col[i3]     = tint[0] * b
      col[i3 + 1] = tint[1] * b
      col[i3 + 2] = tint[2] * b
    }

    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    geo.setAttribute("color",    new THREE.BufferAttribute(col, 3))
    return geo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, spread, tint[0], tint[1], tint[2]])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={baseSize}
        vertexColors
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  )
}

function SpacePhase({ scrollProgress }: { scrollProgress: number }) {
  const opacity =
    scrollProgress < SPACE_FADE_START
      ? 1
      : scrollProgress > SPACE_FADE_END
      ? 0
      : 1 - (scrollProgress - SPACE_FADE_START) / (SPACE_FADE_END - SPACE_FADE_START)

  if (opacity <= 0) return null

  return (
    <>
      <StarLayer count={1200} spread={44} baseSize={1}   tint={[0.38, 0.55, 1.0]} opacity={opacity * 0.55} />
      <StarLayer count={380}  spread={30} baseSize={1.5} tint={[0.55, 0.68, 1.0]} opacity={opacity * 0.78} />
      <StarLayer count={80}   spread={18} baseSize={2.2} tint={[0.88, 0.92, 1.0]} opacity={opacity}        />
    </>
  )
}

// ─── Shared fade-envelope helper ─────────────────────────────────────────────

function lerpFade(
  p: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
): number {
  if (p <= inStart) return 0
  if (p <= inEnd)   return (p - inStart) / (inEnd - inStart)
  if (p <= outStart) return 1
  if (p <= outEnd)  return 1 - (p - outStart) / (outEnd - outStart)
  return 0
}

// ─── Atmosphere Phase ─────────────────────────────────────────────────────────

const ATMO_FADE_IN_START  = 0.28
const ATMO_FADE_IN_END    = 0.44
const ATMO_FADE_OUT_START = 0.60
const ATMO_FADE_OUT_END   = 0.74

const WISP_SEEDS_A: [number, number][] = [
  [-10, 4], [-2, 6], [7, 3], [13, 5], [-6, 1],
  [3, -3], [-14, 2], [10, -2], [-1, -6], [16, 0],
]
const WISP_SEEDS_B: [number, number][] = [
  [-8, -4], [5, -5], [12, 1], [-3, 5], [-11, -1],
  [1, 3], [9, -3], [-5, -2], [15, -4], [-7, 2],
]

interface WispLayerProps {
  clusterSeeds:        [number, number][]
  particlesPerCluster: number
  tint:                [number, number, number]
  opacity:             number
  driftSpeed:          number
  driftPhase:          number
}

function WispLayer({
  clusterSeeds,
  particlesPerCluster,
  tint,
  opacity,
  driftSpeed,
  driftPhase,
}: WispLayerProps) {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const total     = clusterSeeds.length * particlesPerCluster
    const positions = new Float32Array(total * 3)
    const colors    = new Float32Array(total * 3)

    let idx = 0
    for (const [cx, cy] of clusterSeeds) {
      for (let i = 0; i < particlesPerCluster; i++) {
        const u1    = Math.max(1e-6, Math.random())
        const theta = 2 * Math.PI * Math.random()
        const r     = Math.sqrt(-2 * Math.log(u1))

        positions[idx * 3]     = cx + r * Math.cos(theta) * 4.0
        positions[idx * 3 + 1] = cy + r * Math.sin(theta) * 1.0
        positions[idx * 3 + 2] = (Math.random() - 0.5) * 1.5

        const b = 0.3 + Math.random() * 0.5
        colors[idx * 3]     = tint[0] * b
        colors[idx * 3 + 1] = tint[1] * b
        colors[idx * 3 + 2] = tint[2] * b
        idx++
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("color",    new THREE.BufferAttribute(colors,    3))
    return geo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.x = Math.sin(clock.getElapsedTime() * driftSpeed + driftPhase) * 0.4
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={2.8}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  )
}

function AtmospherePhase({ scrollProgress }: { scrollProgress: number }) {
  const opacity = lerpFade(
    scrollProgress,
    ATMO_FADE_IN_START,
    ATMO_FADE_IN_END,
    ATMO_FADE_OUT_START,
    ATMO_FADE_OUT_END,
  )

  if (opacity <= 0) return null

  return (
    <>
      <WispLayer
        clusterSeeds={WISP_SEEDS_A}
        particlesPerCluster={35}
        tint={[0.50, 0.68, 1.0]}
        opacity={opacity * 0.42}
        driftSpeed={0.025}
        driftPhase={0}
      />
      <WispLayer
        clusterSeeds={WISP_SEEDS_B}
        particlesPerCluster={28}
        tint={[0.72, 0.84, 1.0]}
        opacity={opacity * 0.65}
        driftSpeed={0.035}
        driftPhase={Math.PI * 0.7}
      />
    </>
  )
}

// ─── Earth Phase ──────────────────────────────────────────────────────────────

const EARTH_FADE_IN_START = 0.66
const EARTH_FADE_IN_END   = 0.82

const HAZE_SEEDS: [number, number][] = [
  [-12, -5], [-4, -4], [4, -6], [11, -5], [-8, -3],
  [0, -7],   [7, -3],  [-15, -6], [14, -4], [2, -2],
]

function EarthPhase({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const PARTICLES_PER_SEED = 20
    const total     = HAZE_SEEDS.length * PARTICLES_PER_SEED
    const positions = new Float32Array(total * 3)
    const colors    = new Float32Array(total * 3)

    let idx = 0
    for (const [cx, cy] of HAZE_SEEDS) {
      for (let i = 0; i < PARTICLES_PER_SEED; i++) {
        const u1    = Math.max(1e-6, Math.random())
        const theta = 2 * Math.PI * Math.random()
        const r     = Math.sqrt(-2 * Math.log(u1))

        positions[idx * 3]     = cx + r * Math.cos(theta) * 5.0
        positions[idx * 3 + 1] = cy + r * Math.sin(theta) * 1.5
        positions[idx * 3 + 2] = (Math.random() - 0.5) * 1.0

        const b = 0.2 + Math.random() * 0.35
        colors[idx * 3]     = 0.85 * b
        colors[idx * 3 + 1] = 0.42 * b
        colors[idx * 3 + 2] = 0.15 * b
        idx++
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("color",    new THREE.BufferAttribute(colors,    3))
    return geo
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.position.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.2
  })

  let opacity: number
  if (scrollProgress < EARTH_FADE_IN_START) {
    opacity = 0
  } else if (scrollProgress < EARTH_FADE_IN_END) {
    opacity = (scrollProgress - EARTH_FADE_IN_START) / (EARTH_FADE_IN_END - EARTH_FADE_IN_START)
  } else {
    opacity = 1
  }

  if (opacity <= 0) return null

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={3.5}
        vertexColors
        transparent
        opacity={opacity * 0.5}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  )
}

// ─── CSS fallback (no WebGL) ──────────────────────────────────────────────────

const CSS_FALLBACK_BG: Record<ScenePhase, string> = {
  space:      "linear-gradient(180deg, #010714 0%, #020c24 100%)",
  atmosphere: "linear-gradient(180deg, #041e45 0%, #0e3d78 60%, #1a5090 100%)",
  earth:      "linear-gradient(180deg, #0c2040 0%, #1c0a05 70%, #2a0f07 100%)",
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function SceneManager({
  scrollProgress = 0,
  mousePosition  = { x: 0, y: 0 },
  onPhaseChange,
  scenePhase = "hero",
}: SceneManagerProps) {
  const [webGL, setWebGL] = useState<boolean | null>(null)
  const { cardExpanded } = useScrollOrchestrator()

  const mouseRef = useRef(mousePosition)
  mouseRef.current = mousePosition

  // When scenePhase is "deck" the hero exit is in-flight. Push effectiveProgress
  // to ≥0.32 so the lerp-based camera and background start moving toward the
  // Upper Atmosphere immediately, completing the dive over the ~820 ms window.
  const effectiveProgress = scenePhase === "deck"
    ? Math.max(scrollProgress, 0.32)
    : scrollProgress

  useEffect(() => { setWebGL(hasWebGL()) }, [])
  useEffect(() => {
    onPhaseChange?.(getPhaseFromScroll(effectiveProgress))
  }, [effectiveProgress, onPhaseChange])

  if (webGL === null) return null

  if (!webGL) {
    const phase = getPhaseFromScroll(effectiveProgress)
    return (
      <div
        aria-hidden="true"
        style={{
          position:   "fixed",
          inset:      0,
          zIndex:     0,
          pointerEvents: "none",
          background: CSS_FALLBACK_BG[phase],
          transition: "background 0.6s ease",
        }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: false, alpha: false }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => gl.setClearColor(BG_SPACE, 1)}
      >
        {/* Scene setup */}
        <BackgroundColor scrollProgress={effectiveProgress} />
        <CameraRig
          scrollProgress={effectiveProgress}
          mouseRef={mouseRef}
          cardExpanded={cardExpanded}
        />

        {/* Space phase: constellation + starfield — hero-exclusive, unmount on dive start */}
        {scenePhase === "hero" && (
          <>
            <FilamentConstellation scrollProgress={effectiveProgress} mouseRef={mouseRef} />
            <SpacePhase scrollProgress={effectiveProgress} />
          </>
        )}

        {/* Transition phases */}
        <AtmospherePhase scrollProgress={effectiveProgress} />
        <EarthPhase      scrollProgress={effectiveProgress} />

        {/* Post-processing: Bloom makes the filaments and bright stars glow */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={1.35}
            luminanceThreshold={0.22}
            luminanceSmoothing={0.88}
            mipmapBlur
            radius={0.80}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
