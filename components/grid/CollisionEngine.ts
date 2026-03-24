"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { ApertureCard } from "./useApertureFilter"
export { EASE_OUT } from "@/lib/motion"

// ─── Public Types ─────────────────────────────────────────────────────────────

export type CardPhase = "grid" | "sliding" | "center" | "gutter" | "returning"

export interface PuzzleCardState {
  x: number
  y: number
  width: number
  height: number
  opacity: number
  filter: string
  zIndex: number
  phase: CardPhase
  homeSlot: SlotCoord
  homeX: number
  homeY: number
}

export interface PuzzleEngineState {
  cardStates: Record<string, PuzzleCardState>
  activeId: string | null
  isExpanded: boolean
  activateCard: (id: string) => void
  closeActive: () => void
}

// ─── Internal Types ───────────────────────────────────────────────────────────

export type SlotCoord = { col: number; row: number }
type AnimFrame = Record<string, { x: number; y: number }>

// ─── Layout Constants ─────────────────────────────────────────────────────────

export const COLS        = 3
export const CARD_HEIGHT = 200
export const CARD_GAP    = 12
export const SIDE_PAD    = 16
export const TOP_PAD_RATIO = 0.22     // 22vh top padding (mirrors the old scroll padding)

// ─── Animation Constants ──────────────────────────────────────────────────────

const STEP_MS         = 580  // ms between each slot-hop frame — long enough to watch each swap land
const POST_PATH_MS    = 300  // pause after last step so the card settles before scatter
export const SPRING: { type: "spring"; stiffness: number; damping: number } = {
  type: "spring",
  stiffness: 250,
  damping: 25,
}

// ─── Pure Slot Helpers ────────────────────────────────────────────────────────

function sk(s: SlotCoord): string {
  return `${s.col},${s.row}`
}

export function cardWidth(containerW: number): number {
  return Math.max(
    160,
    Math.floor((containerW - SIDE_PAD * 2 - CARD_GAP * (COLS - 1)) / COLS),
  )
}

export function slotTopLeft(
  col: number,
  row: number,
  containerW: number,
  containerH: number,
): { x: number; y: number } {
  const cw = cardWidth(containerW)
  return {
    x: SIDE_PAD + col * (cw + CARD_GAP),
    y: containerH * TOP_PAD_RATIO + row * (CARD_HEIGHT + CARD_GAP),
  }
}

// Deterministic per-card hash — picks a stable perpendicular shove direction
// without introducing Math.random() jitter on re-renders.
function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Cardinal path from `from` → `to` (column-first Manhattan walk).
function buildPath(from: SlotCoord, to: SlotCoord): SlotCoord[] {
  const path: SlotCoord[] = []
  let c = from.col
  let r = from.row
  while (c !== to.col) {
    c += Math.sign(to.col - c)
    path.push({ col: c, row: r })
  }
  while (r !== to.row) {
    r += Math.sign(to.row - r)
    path.push({ col: c, row: r })
  }
  return path
}

// Grid slot whose center is closest to the viewport center.
function findCenterSlot(cardCount: number, W: number, H: number): SlotCoord {
  const rows = Math.ceil(cardCount / COLS)
  const cw   = cardWidth(W)
  const cx   = W / 2
  const cy   = H / 2
  let best   = { col: 1, row: 0 }
  let minD   = Infinity
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < rows; r++) {
      const p  = slotTopLeft(c, r, W, H)
      const mx = p.x + cw / 2
      const my = p.y + CARD_HEIGHT / 2
      const d  = Math.hypot(mx - cx, my - cy)
      if (d < minD) { minD = d; best = { col: c, row: r } }
    }
  }
  return best
}

// ─── Recursive Shove ──────────────────────────────────────────────────────────
//
// Moves `cardId` one step in `dir`. If that slot is occupied, the occupant is
// shoved in the same direction first (chain reaction). If the target is out of
// bounds, the card is pushed off-grid (gutter scatter will clean it up).
//
// Mutates `cardSlots` and `occupancy` in-place; returns the set of x/y changes.

function shoveCard(
  cardId: string,
  dir: { dc: number; dr: number },
  cardSlots: Map<string, SlotCoord>,
  occupancy: Map<string, string>,
  W: number,
  H: number,
  rows: number,
  depth = 0,
): AnimFrame {
  const result: AnimFrame = {}
  if (depth > 8) return result          // guard against degenerate inputs
  const cur = cardSlots.get(cardId)
  if (!cur) return result

  const target = { col: cur.col + dir.dc, row: cur.row + dir.dr }
  const inBounds =
    target.col >= 0 && target.col < COLS &&
    target.row >= 0 && target.row < rows

  if (!inBounds) {
    // Card flies off the grid — will be re-placed by gutter scatter.
    const cw   = cardWidth(W)
    const offX =
      dir.dc < 0 ? -(cw + CARD_GAP + 20)
      : dir.dc > 0 ? W + 20
      : slotTopLeft(cur.col, cur.row, W, H).x
    const offY =
      dir.dr < 0 ? -(CARD_HEIGHT + CARD_GAP + 20)
      : dir.dr > 0 ? H + 20
      : slotTopLeft(cur.col, cur.row, W, H).y
    occupancy.delete(sk(cur))
    result[cardId] = { x: offX, y: offY }
    return result
  }

  const nextResident = occupancy.get(sk(target))
  if (nextResident && nextResident !== cardId) {
    const chain = shoveCard(nextResident, dir, cardSlots, occupancy, W, H, rows, depth + 1)
    Object.assign(result, chain)
  }

  occupancy.delete(sk(cur))
  occupancy.set(sk(target), cardId)
  cardSlots.set(cardId, target)

  const p = slotTopLeft(target.col, target.row, W, H)
  result[cardId] = { x: p.x, y: p.y }
  return result
}

// ─── Path + Collision Frame Builder ──────────────────────────────────────────
//
// Pre-computes the full animation sequence from `activeId`'s home slot to the
// center slot. Returns one AnimFrame per step; each frame is a partial map of
// { cardId → { x, y } } that Framer Motion applies in the next render cycle.

function computeFrames(
  activeId: string,
  states: Record<string, PuzzleCardState>,
  W: number,
  H: number,
): { frames: AnimFrame[]; centerSlot: SlotCoord } {
  const cardCount  = Object.keys(states).length
  const rows       = Math.ceil(cardCount / COLS)
  const centerSlot = findCenterSlot(cardCount, W, H)

  // Working copies for simulation
  const occupancy  = new Map<string, string>()
  const cardSlots  = new Map<string, SlotCoord>()

  Object.entries(states).forEach(([id, s]) => {
    occupancy.set(sk(s.homeSlot), id)
    cardSlots.set(id, { ...s.homeSlot })
  })

  const activeSlot = cardSlots.get(activeId)!
  const path       = buildPath(activeSlot, centerSlot)
  const frames: AnimFrame[] = []
  let curSlot = { ...activeSlot }

  for (const targetSlot of path) {
    const frame: AnimFrame = {}
    const travelDx = targetSlot.col - curSlot.col
    const travelDy = targetSlot.row - curSlot.row

    const residentId = occupancy.get(sk(targetSlot))
    if (residentId && residentId !== activeId) {
      // Pick perpendicular direction via deterministic hash so the same card
      // always shoves the same way across renders.
      const h      = hashId(residentId)
      const perpDir =
        travelDx !== 0
          ? { dc: 0, dr: h % 2 === 0 ? -1 : 1 }
          : { dc: h % 2 === 0 ? -1 : 1, dr: 0 }
      Object.assign(frame, shoveCard(residentId, perpDir, cardSlots, occupancy, W, H, rows))
    }

    // Advance active card
    occupancy.delete(sk(curSlot))
    occupancy.set(sk(targetSlot), activeId)
    cardSlots.set(activeId, targetSlot)
    curSlot = targetSlot

    const p = slotTopLeft(targetSlot.col, targetSlot.row, W, H)
    frame[activeId] = { x: p.x, y: p.y }
    frames.push(frame)
  }

  return { frames, centerSlot }
}

// ─── Gutter Placement ────────────────────────────────────────────────────────
//
// Distributes non-active cards to the 4 viewport edges, partially off-screen.
// Assignment is based on nearest edge from each card's current position.

function computeGutterPositions(
  nonActiveIds: string[],
  currentStates: Record<string, PuzzleCardState>,
  W: number,
  H: number,
): Record<string, { x: number; y: number }> {
  const cw = cardWidth(W)
  type Edge = "top" | "bottom" | "left" | "right"
  const byEdge: Record<Edge, string[]> = { top: [], bottom: [], left: [], right: [] }

  nonActiveIds.forEach((id) => {
    const s  = currentStates[id]
    const cx = s.x + cw / 2
    const cy = s.y + CARD_HEIGHT / 2
    const dTop    = cy
    const dBottom = H - cy
    const dLeft   = cx
    const dRight  = W - cx
    const min = Math.min(dTop, dBottom, dLeft, dRight)
    if (min === dTop)    byEdge.top.push(id)
    else if (min === dBottom) byEdge.bottom.push(id)
    else if (min === dLeft)   byEdge.left.push(id)
    else                      byEdge.right.push(id)
  })

  // Rebalance: horizontal edges take at most ceil(n/2) cards
  const maxH = Math.ceil(nonActiveIds.length / 2)
  for (const edge of ["top", "bottom"] as Edge[]) {
    while (byEdge[edge].length > maxH) {
      const overflow = byEdge[edge].pop()!
      ;(byEdge.left.length <= byEdge.right.length ? byEdge.left : byEdge.right).push(overflow)
    }
  }

  const result: Record<string, { x: number; y: number }> = {}

  // Top: peek from above (y = -72% of card height)
  byEdge.top.forEach((id, i) => {
    const n = byEdge.top.length
    result[id] = {
      x: (W / (n + 1)) * (i + 1) - cw / 2,
      y: -(CARD_HEIGHT * 0.65),
    }
  })

  // Bottom: peek from below
  byEdge.bottom.forEach((id, i) => {
    const n = byEdge.bottom.length
    result[id] = {
      x: (W / (n + 1)) * (i + 1) - cw / 2,
      y: H - CARD_HEIGHT * 0.35,
    }
  })

  // Left: peek from left
  byEdge.left.forEach((id, i) => {
    const n = byEdge.left.length
    result[id] = {
      x: -(cw * 0.65),
      y: (H / (n + 1)) * (i + 1) - CARD_HEIGHT / 2,
    }
  })

  // Right: peek from right
  byEdge.right.forEach((id, i) => {
    const n = byEdge.right.length
    result[id] = {
      x: W - cw * 0.35,
      y: (H / (n + 1)) * (i + 1) - CARD_HEIGHT / 2,
    }
  })

  return result
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePuzzleEngine(
  cards: ApertureCard[],
  containerRef: React.RefObject<HTMLDivElement | null>,
): PuzzleEngineState {
  const [cardStates, setCardStates] = useState<Record<string, PuzzleCardState>>({})
  const [activeId,   setActiveId]   = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Mirror latest state to a ref for synchronous reads inside setTimeout callbacks
  // (avoids stale closures without making setCardStates impure).
  const statesRef = useRef<Record<string, PuzzleCardState>>({})
  useEffect(() => { statesRef.current = cardStates }, [cardStates])

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // ── Build initial (grid) states from a card list ───────────────────────────

  const buildInitialStates = useCallback(
    (cardList: ApertureCard[], W: number, H: number): Record<string, PuzzleCardState> => {
      const cw = cardWidth(W)
      const result: Record<string, PuzzleCardState> = {}
      cardList.forEach((card, idx) => {
        const col = idx % COLS
        const row = Math.floor(idx / COLS)
        const p   = slotTopLeft(col, row, W, H)
        result[card.id] = {
          x: p.x, y: p.y,
          width: cw, height: CARD_HEIGHT,
          opacity: 1, filter: "blur(0px)", zIndex: 10,
          phase: "grid",
          homeSlot: { col, row },
          homeX: p.x, homeY: p.y,
        }
      })
      return result
    },
    [],
  )

  // Reinitialize on card list change (filter switch or new deal)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    clearTimers()
    setActiveId(null)
    setIsExpanded(false)
    const { clientWidth: W, clientHeight: H } = container
    const initial = buildInitialStates(cards, W, H)
    statesRef.current = initial
    setCardStates(initial)
  }, [cards, containerRef, buildInitialStates, clearTimers])

  // Recompute slot positions on resize (only when puzzle is idle)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    function onResize() {
      // Don't disrupt an in-progress puzzle
      if (statesRef.current && Object.values(statesRef.current).some(s => s.phase !== "grid")) return
      const { clientWidth: W, clientHeight: H } = container!
      const updated = buildInitialStates(cards, W, H)
      statesRef.current = updated
      setCardStates(updated)
    }
    window.addEventListener("resize", onResize, { passive: true })
    return () => window.removeEventListener("resize", onResize)
  }, [cards, containerRef, buildInitialStates])

  // ── Activate Card ──────────────────────────────────────────────────────────

  const activateCard = useCallback(
    (id: string) => {
      const container = containerRef.current
      if (!container) return

      clearTimers()
      setIsExpanded(false)

      const { clientWidth: W, clientHeight: H } = container
      const snapshot = statesRef.current
      if (!snapshot[id]) return

      // Pre-compute the full animation plan from the current snapshot
      const { frames, centerSlot } = computeFrames(id, snapshot, W, H)
      const centerPos   = slotTopLeft(centerSlot.col, centerSlot.row, W, H)
      const totalPathMs = frames.length * STEP_MS

      // Step 0: mark as sliding (immediate)
      setCardStates(s => ({ ...s, [id]: { ...s[id], phase: "sliding", zIndex: 50 } }))

      // Steps 1..N: apply each collision frame
      frames.forEach((frame, i) => {
        const t = setTimeout(() => {
          setCardStates(s => {
            const next = { ...s }
            Object.entries(frame).forEach(([cid, pos]) => {
              if (next[cid]) next[cid] = { ...next[cid], x: pos.x, y: pos.y }
            })
            return next
          })
        }, (i + 1) * STEP_MS)
        timersRef.current.push(t)
      })

      // After path: land active card exactly on center slot
      const tSnap = setTimeout(() => {
        setCardStates(s => ({
          ...s,
          [id]: { ...s[id], x: centerPos.x, y: centerPos.y, phase: "center" },
        }))
      }, totalPathMs + POST_PATH_MS)
      timersRef.current.push(tSnap)

      // Aperture: gutter scatter + expansion fire in the same render frame (React 18 batches both setState calls)
      const tAperture = setTimeout(() => {
        setCardStates(s => {
          const nonActive = Object.keys(s).filter(cid => cid !== id)
          const gutterPos = computeGutterPositions(nonActive, s, W, H)
          const next = { ...s }
          next[id] = { ...s[id], x: centerPos.x, y: centerPos.y, phase: "center", zIndex: 50 }
          nonActive.forEach(cid => {
            const gp = gutterPos[cid] ?? { x: -300, y: 0 }
            next[cid] = {
              ...s[cid],
              x: gp.x, y: gp.y,
              phase: "gutter",
              zIndex: 45,
              opacity: 0.45,
              filter: "blur(3px)",
            }
          })
          return next
        })
        setIsExpanded(true)
      }, totalPathMs + POST_PATH_MS + STEP_MS)
      timersRef.current.push(tAperture)

      setActiveId(id)
    },
    [containerRef, clearTimers],
  )

  // ── Close / Re-assembly ────────────────────────────────────────────────────

  const closeActive = useCallback(() => {
    clearTimers()
    setIsExpanded(false)

    // Small delay: let the expanded card shrink to card size before springing home.
    // width/height are left as-is — CardGrid.tsx controls expansion visually;
    // the engine always stores slot dimensions.
    const tReturn = setTimeout(() => {
      setCardStates(s => {
        const next = { ...s }
        Object.entries(s).forEach(([cid, state]) => {
          next[cid] = {
            ...state,
            x: state.homeX, y: state.homeY,
            opacity: 1, filter: "blur(0px)", zIndex: 10,
            phase: "returning",
          }
        })
        return next
      })

      // Reset phases after spring settles (~600ms for stiffness 250 / damping 25)
      const tReset = setTimeout(() => {
        setCardStates(s => {
          const next = { ...s }
          Object.entries(s).forEach(([cid, st]) => {
            next[cid] = { ...st, phase: "grid" }
          })
          return next
        })
        setActiveId(null)
      }, 700)
      timersRef.current.push(tReset)
    }, 200)
    timersRef.current.push(tReturn)
  }, [clearTimers])

  return { cardStates, activeId, isExpanded, activateCard, closeActive }
}
