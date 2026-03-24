"use client"

import { useCallback, useState } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DisplacementFx {
  x: number
  y: number
  opacity: number
  scale: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Cubic-bezier approximation of GSAP Power4.out.
 * Use as `transition={{ ease: POWER4_OUT }}` in Framer Motion.
 */
export const POWER4_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

const MIN_PUSH_PX = 55
const MAX_PUSH_PX = 95

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Radial Displacement — the "Secret Brick" physics.
 *
 * On applyDisplacement(clickedId):
 *  1. Read every registered card's bounding rect.
 *  2. Compute a unit vector from the clicked card's center to each peer.
 *  3. Scale that vector by MIN_PUSH–MAX_PUSH px (deterministic per-card, no
 *     random jitter on re-renders) and record it as an (x, y) CSS transform.
 *  4. Dim all peers to opacity 0.1.
 *
 * Use the returned `displacementFx` map as `animate` targets on each card's
 * <motion.article>, and `POWER4_OUT` as the easing for that transition.
 */
export function useRadialDisplacement(
  cardMapRef: React.RefObject<Map<string, HTMLElement>>,
) {
  const [displacementFx, setDisplacementFx] = useState<Record<string, DisplacementFx>>({})

  const applyDisplacement = useCallback(
    (clickedId: string) => {
      const map = cardMapRef.current
      if (!map) return

      const originEl = map.get(clickedId)
      if (!originEl) return

      const originRect = originEl.getBoundingClientRect()
      const ox = originRect.left + originRect.width / 2
      const oy = originRect.top + originRect.height / 2

      const next: Record<string, DisplacementFx> = {}

      map.forEach((el, id) => {
        if (id === clickedId) {
          // The clicked card stays put; the layoutId morph handles the expansion.
          next[id] = { x: 0, y: 0, opacity: 1, scale: 1 }
          return
        }

        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2

        // Direction vector from origin to peer
        const dx = cx - ox
        const dy = cy - oy
        const dist = Math.sqrt(dx * dx + dy * dy) || 1

        // Deterministic magnitude keyed to the id string — no random jitter on
        // re-renders. Hash is just a stable seed, not a security concern.
        const seed = id
          .split("")
          .reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0)
        const mag = MIN_PUSH_PX + (Math.abs(seed) % (MAX_PUSH_PX - MIN_PUSH_PX))

        next[id] = {
          x: (dx / dist) * mag,
          y: (dy / dist) * mag,
          opacity: 0.1,
          scale: 0.95,
        }
      })

      setDisplacementFx(next)
    },
    [cardMapRef],
  )

  const resetDisplacement = useCallback(() => setDisplacementFx({}), [])

  return { displacementFx, applyDisplacement, resetDisplacement }
}
