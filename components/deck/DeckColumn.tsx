"use client"

import { AnimatePresence, motion, useMotionValue, type MotionValue } from "framer-motion"
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import DeckCard, { type DeckCardModel } from "./DeckCard"
import type { ScenePhase } from "@/components/scene/SceneManager"

// ── Public handle ───────────────────────────────────────────────────────────────

export interface DeckColumnHandle {
  scrollToCard: (index: number) => void
  expandCardAtIndex: (index: number) => void
  collapseExpanded: () => void
}

// ── Phase → accent colour ───────────────────────────────────────────────────────

const PHASE_COLOR: Record<ScenePhase, string> = {
  space:      "rgba(224,182,255,0.75)",  // primary
  atmosphere: "rgba(156,210,240,0.65)",
  earth:      "rgba(208,194,213,0.55)",
}

// ── Props ───────────────────────────────────────────────────────────────────────

export interface DeckColumnProps {
  title: string
  subtitle?: string
  cards: DeckCardModel[]
  onFocusedIndexChange: (index: number) => void
  isActive?: boolean
  phase?: ScenePhase
  onPointerInteraction?: () => void
  /** Pass false to suppress the title + active-bar header (e.g. when an external switcher owns the heading). */
  showHeader?: boolean
}

/** @deprecated — use DeckColumnHandle instead */
export interface DeckColumnApi {
  containerRef: React.RefObject<HTMLDivElement | null>
  focusedIndexMV: MotionValue<number>
}

// ── Component ───────────────────────────────────────────────────────────────────

const DeckColumn = forwardRef<DeckColumnHandle, DeckColumnProps>(
  function DeckColumn(
    {
      title,
      cards,
      onFocusedIndexChange,
      isActive = true,
      phase = "space",
      onPointerInteraction,
      showHeader = true,
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const cardElsRef   = useRef<Array<HTMLDivElement | null>>([])

    const focusedIndexMV  = useMotionValue(0)
    const focusedIndexRef = useRef(0)

    const [expandedId, setExpandedId] = useState<string | null>(null)
    const expandedIdRef = useRef<string | null>(null)
    const cardsRef      = useRef<DeckCardModel[]>(cards)

    useEffect(() => { expandedIdRef.current = expandedId }, [expandedId])
    useEffect(() => { cardsRef.current = cards }, [cards])

    const isActiveRef = useRef(isActive)
    useEffect(() => { isActiveRef.current = isActive }, [isActive])

    const onPointerInteractionRef = useRef(onPointerInteraction)
    useEffect(() => { onPointerInteractionRef.current = onPointerInteraction }, [onPointerInteraction])

    // ── Imperative handle ──────────────────────────────────────────────────────
    useImperativeHandle(
      ref,
      () => ({
        scrollToCard(index: number) {
          const container = containerRef.current
          const el = cardElsRef.current[index]
          if (!el || !container) return
          container.scrollTo({
            top:      Math.max(0, el.offsetTop - (container.clientHeight - el.offsetHeight) / 2),
            behavior: "smooth",
          })
        },
        expandCardAtIndex(index: number) {
          const id = cardsRef.current[index]?.id
          if (id) handleExpandRef.current(id)
        },
        collapseExpanded() { setExpandedId(null) },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    )

    const handleExpand = useCallback((id: string) => {
      setExpandedId((prev) => (prev === id ? null : id))
      onPointerInteractionRef.current?.()
    }, [])

    const handleExpandRef = useRef(handleExpand)
    useEffect(() => { handleExpandRef.current = handleExpand }, [handleExpand])

    const register = useCallback(
      (index: number) => (el: HTMLDivElement | null) => { cardElsRef.current[index] = el },
      []
    )

    const computeFocusedIndex = useCallback(() => {
      const container = containerRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const centerY = containerRect.top + containerRect.height / 2

      let bestIndex = 0
      let bestDist  = Number.POSITIVE_INFINITY

      for (let i = 0; i < cardElsRef.current.length; i++) {
        const el = cardElsRef.current[i]
        if (!el) continue
        const r = el.getBoundingClientRect()
        const elCenter = r.top + r.height / 2
        const dist = Math.abs(elCenter - centerY)
        if (dist < bestDist) { bestDist = dist; bestIndex = i }
      }

      if (bestIndex !== focusedIndexRef.current) {
        focusedIndexRef.current = bestIndex
        focusedIndexMV.set(bestIndex)
        onFocusedIndexChange(bestIndex)
      }
    }, [focusedIndexMV, onFocusedIndexChange])

    const checkAutoCollapse = useCallback(() => {
      const currentExpandedId = expandedIdRef.current
      if (!currentExpandedId) return
      const container = containerRef.current
      if (!container) return

      const expandedIndex = cardsRef.current.findIndex((c) => c.id === currentExpandedId)
      if (expandedIndex < 0) return
      const el = cardElsRef.current[expandedIndex]
      if (!el) return

      const containerRect   = container.getBoundingClientRect()
      const containerCenterY = containerRect.top + containerRect.height / 2
      const cardRect        = el.getBoundingClientRect()
      const cardCenterY     = cardRect.top + cardRect.height / 2

      if (Math.abs(cardCenterY - containerCenterY) > cardRect.height) setExpandedId(null)
    }, [])

    const rafPending = useRef(false)
    const onScroll = useCallback(() => {
      if (rafPending.current) return
      rafPending.current = true
      requestAnimationFrame(() => {
        rafPending.current = false
        computeFocusedIndex()
        checkAutoCollapse()
        if (!isActiveRef.current) onPointerInteractionRef.current?.()
      })
    }, [computeFocusedIndex, checkAutoCollapse])

    useEffect(() => {
      if (!expandedId) return
      const container = containerRef.current
      if (!container) return
      const timer = setTimeout(() => {
        const idx = cardsRef.current.findIndex((c) => c.id === expandedId)
        if (idx < 0) return
        const el = cardElsRef.current[idx]
        if (!el) return
        container.scrollTo({
          top:      Math.max(0, el.offsetTop - (container.clientHeight - el.offsetHeight) / 2),
          behavior: "smooth",
        })
      }, 0)
      return () => clearTimeout(timer)
    }, [expandedId])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isActiveRef.current && expandedIdRef.current) setExpandedId(null)
      }
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    useEffect(() => {
      const el = containerRef.current
      if (!el) return
      computeFocusedIndex()
      el.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll, { passive: true })
      return () => {
        el.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onScroll)
      }
    }, [computeFocusedIndex, onScroll])

    const content = useMemo(() => {
      cardElsRef.current = new Array(cards.length).fill(null)
      const expandedIndex = expandedId ? cards.findIndex((c) => c.id === expandedId) : -1
      return cards.map((c, i) => (
        <DeckCard
          key={c.id}
          card={c}
          index={i}
          containerRef={containerRef}
          focusedIndex={focusedIndexMV}
          register={register}
          isExpanded={c.id === expandedId}
          isPeek={
            expandedIndex >= 0 &&
            (i === expandedIndex - 1 || i === expandedIndex + 1)
          }
          onExpand={() => handleExpand(c.id)}
        />
      ))
    }, [cards, expandedId, focusedIndexMV, register, handleExpand])

    const accentColor = PHASE_COLOR[phase]

    return (
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          height:         "100%",
          minHeight:      0,
          // Horizontal padding inside each column
          padding:        "0 clamp(1.5rem, 4vw, 3.5rem)",
        }}
      >
        {/* ── Column header (suppressed when showHeader={false}) ── */}
        {showHeader && (
          <div
            style={{
              position:       "relative",
              paddingTop:     "2.5rem",
              paddingBottom:  "1.25rem",
              flexShrink:     0,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <h2
                style={{
                  fontSize:      "0.62rem",
                  fontFamily:    "var(--font-space-grotesk), var(--font-geist-sans), sans-serif",
                  fontWeight:    600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color:         isActive ? "rgba(244,237,248,0.75)" : "rgba(208,194,213,0.38)",
                  transition:    "color 0.3s ease",
                  whiteSpace:    "nowrap",
                }}
              >
                {title}
              </h2>
              <div
                aria-hidden="true"
                style={{
                  flex:       1,
                  height:     "1px",
                  background: "linear-gradient(to right, rgba(74,66,73,0.3), transparent)",
                }}
              />
            </div>

            {/* Phase-adaptive focus indicator bar */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="col-focus-bar"
                  initial={{ opacity: 0, scaleX: 0.5 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.5 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  aria-hidden="true"
                  style={{
                    position:        "absolute",
                    bottom:          0,
                    left:            0,
                    right:           0,
                    height:          "1px",
                    originX:         0,
                    borderRadius:    "9999px",
                    backgroundColor: accentColor,
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Scrollable card list with cloud-bank gradient masks ── */}
        {/*                                                            */}
        {/* The mask-image fades the top 18% and bottom 18% of the   */}
        {/* scroll container to transparent, so cards smoothly appear */}
        {/* from below and disappear into the "cloud bank" above.     */}
        {/* paddingTop pushes the first card down to the center of    */}
        {/* the visible zone so it starts as the "main" card.         */}
        <div
          ref={containerRef}
          style={{
            flex:                 "1 1 0",
            minHeight:            0,
            overflowY:            "scroll",
            // Hide scrollbar cross-browser
            scrollbarWidth:       "none",
            msOverflowStyle:      "none",
            // Cloud-bank gradient masks
            maskImage: `linear-gradient(
              to bottom,
              transparent        0%,
              rgba(0,0,0,0.5)   10%,
              black             22%,
              black             78%,
              rgba(0,0,0,0.5)   90%,
              transparent       100%
            )`,
            WebkitMaskImage: `linear-gradient(
              to bottom,
              transparent        0%,
              rgba(0,0,0,0.5)   10%,
              black             22%,
              black             78%,
              rgba(0,0,0,0.5)   90%,
              transparent       100%
            )`,
          } as React.CSSProperties}
        >
          {/* Hide Webkit scrollbar thumb */}
          <style>{`
            .deck-col-scroll::-webkit-scrollbar { display: none; }
          `}</style>

          <div
            style={{
              display:        "flex",
              flexDirection:  "column",
              gap:            "0.75rem",
              // Push first card to the viewport center of the visible zone.
              // The cloud mask covers ~22% at top, so visible zone starts at
              // ~22% of container height. paddingTop ≈ 38vh puts the first
              // card roughly at the optical center of the column.
              paddingTop:     "38vh",
              paddingBottom:  "42vh",
            }}
          >
            {content}
          </div>
        </div>
      </div>
    )
  }
)

DeckColumn.displayName = "DeckColumn"
export default DeckColumn
