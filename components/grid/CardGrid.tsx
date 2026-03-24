"use client"

import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { useDynamicGridController } from "./DynamicGridController"
import { useApertureFilter, type ApertureCard, type ApertureFilter } from "./useApertureFilter"
import { useRadialDisplacement, POWER4_OUT } from "./useRadialDisplacement"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardGridProps {
  dealSeed: number
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLOR = {
  experience: "rgba(156,210,240,0.82)",
  project:    "rgba(224,182,255,0.82)",
  surface:    "rgba(10,10,12,0.62)",
  border:     "rgba(74,66,73,0.3)",
  text:       "rgba(244,237,248,0.92)",
  subtext:    "rgba(208,194,213,0.75)",
  dim:        "rgba(208,194,213,0.55)",
} as const

// ─── CloudBank ────────────────────────────────────────────────────────────────

function CloudBank({ side }: { side: "top" | "bottom" }) {
  const isTop = side === "top"
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0"
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height: "20vh",
        zIndex: 30,
        background: isTop
          ? "linear-gradient(to bottom, rgba(21,19,20,0.95), rgba(21,19,20,0.72) 48%, rgba(21,19,20,0.35) 82%, transparent)"
          : "linear-gradient(to top, rgba(21,19,20,0.95), rgba(21,19,20,0.72) 48%, rgba(21,19,20,0.35) 82%, transparent)",
      }}
    >
      <div
        style={{
          position: "absolute",
          [isTop ? "bottom" : "top"]: 0,
          left: "7%",
          right: "7%",
          height: "2px",
          filter: "blur(3px)",
          background:
            "linear-gradient(to right, transparent, rgba(224,182,255,0.45) 45%, rgba(224,182,255,0.45) 55%, transparent)",
        }}
      />
    </div>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

const FILTER_OPTIONS: { value: ApertureFilter; label: string }[] = [
  { value: "all",        label: "All" },
  { value: "experience", label: "Experience" },
  { value: "project",    label: "Projects" },
]

function FilterBar({
  active,
  onChange,
}: {
  active: ApertureFilter
  onChange: (f: ApertureFilter) => void
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        justifyContent: "center",
        marginBottom: "1.25rem",
        position: "relative",
        zIndex: 31,
      }}
    >
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            style={{
              padding: "0.3rem 0.9rem",
              borderRadius: 999,
              border: `1px solid ${isActive ? "rgba(224,182,255,0.55)" : "rgba(74,66,73,0.4)"}`,
              background: isActive ? "rgba(224,182,255,0.1)" : "transparent",
              color: isActive ? "rgba(224,182,255,0.9)" : "rgba(208,194,213,0.55)",
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Expanded Card Modal ──────────────────────────────────────────────────────

function ExpandedCard({
  card,
  onClose,
}: {
  card: ApertureCard
  onClose: () => void
}) {
  const accentColor = card.type === "experience" ? COLOR.experience : COLOR.project

  return (
    <motion.div
      key={card.id}
      layoutId={`grid-${card.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-6"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.72)" }}
    >
      {/* ── Expanded brick ─────────────────────────────────────────────── */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(940px, 92vw)",
          maxHeight: "84vh",
          overflowY: "auto",
          borderRadius: 20,
          border: `1px solid ${accentColor.replace("0.82", "0.32")}`,
          background: "rgba(14,12,16,0.88)",
          // 3D Depth separation — separates the expanded surface from the
          // deep-space background that is now lunging forward behind it.
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          padding: "1.5rem 1.4rem",
        }}
      >
        {/* Type label */}
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accentColor,
          }}
        >
          {card.type}
        </p>

        {/* Title */}
        <h2
          style={{
            marginTop: "0.5rem",
            fontSize: "clamp(1.35rem, 3vw, 1.9rem)",
            lineHeight: 1.2,
            color: COLOR.text,
          }}
        >
          {card.title}
        </h2>
        <p style={{ marginTop: "0.35rem", fontSize: "0.8rem", color: COLOR.subtext }}>
          {card.meta}
        </p>

        {/* ── Key metrics — first things visible in the expanded view ──── */}
        {card.highlights.length > 0 && (
          <div style={{ marginTop: "1.25rem" }}>
            <p
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: accentColor.replace("0.82", "0.55"),
                marginBottom: "0.6rem",
              }}
            >
              Highlights
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.55rem" }}>
              {card.highlights.map((h, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.65rem",
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    color: COLOR.subtext,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: "0.35rem",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: accentColor,
                    }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            marginTop: "1.1rem",
            fontSize: "0.82rem",
            lineHeight: 1.65,
            color: COLOR.dim,
          }}
        >
          {card.description}
        </p>

        {/* Tags */}
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.45rem",
          }}
        >
          {card.tags.slice(0, 10).map((tag) => (
            <span
              key={tag}
              style={{
                borderRadius: 999,
                background: "rgba(74,66,73,0.35)",
                color: COLOR.subtext,
                padding: "0.2rem 0.65rem",
                fontSize: "0.68rem",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Close hint */}
        <p
          style={{
            marginTop: "1.4rem",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(208,194,213,0.3)",
            textAlign: "center",
          }}
        >
          Click outside to close
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardGrid({ dealSeed }: CardGridProps) {
  const { setLeftFocusedIndex, setCardExpanded } = useScrollOrchestrator()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // 1) Priority Sort + Active Filtering
  const { filter, setFilter, orderedCards } = useApertureFilter()

  // 2) Cloud opacity (scroll-based fade bands) + card ref registration
  //    Order is now owned by useApertureFilter, not the controller.
  const { visibleIds, cardFx, cardMapRef, registerCardRef, expandedId, onCardSelect, closeExpanded } =
    useDynamicGridController(orderedCards, scrollRef)

  // 3) Radial Displacement — Secret Brick physics
  const { displacementFx, applyDisplacement, resetDisplacement } =
    useRadialDisplacement(cardMapRef as React.RefObject<Map<string, HTMLElement>>)

  // Snapshot so the modal keeps rendering during the exit animation
  const [expandedSnapshot, setExpandedSnapshot] = useState<ApertureCard | null>(null)

  // ── Sync expanded state to context so SceneManager can trigger Z-Lunge ──
  useEffect(() => {
    setCardExpanded(!!expandedId)
  }, [expandedId, setCardExpanded])

  useEffect(() => {
    if (!expandedId) {
      setExpandedSnapshot(null)
      return
    }
    const card = orderedCards.find((c) => c.id === expandedId) ?? null
    setExpandedSnapshot(card)
  }, [expandedId, orderedCards])

  // ── Focused-index reporting for QuickNav ────────────────────────────────
  useEffect(() => {
    if (!visibleIds.length) return
    const firstVisible = orderedCards.findIndex((c) => c.id === visibleIds[0])
    if (firstVisible >= 0) setLeftFocusedIndex(firstVisible)
  }, [orderedCards, setLeftFocusedIndex, visibleIds])

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleCardClick(id: string) {
    onCardSelect(id)
    applyDisplacement(id)
  }

  function handleClose() {
    closeExpanded()
    resetDisplacement()
  }

  return (
    <div className="relative w-full" style={{ height: "100vh", zIndex: 10 }}>
      <CloudBank side="top" />
      <CloudBank side="bottom" />

      <div
        ref={scrollRef}
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "22vh 1rem 10vh",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Filter bar sits above the grid, inside the scroll area so it
            scrolls away naturally as the user moves down. */}
        <FilterBar active={filter} onChange={setFilter} />

        <LayoutGroup id="aperture-grid">
          <motion.div
            key={dealSeed}
            layout
            className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-3"
          >
            {orderedCards.map((card, idx) => {
              const cloudOpacity  = cardFx[card.id]?.opacity ?? 1
              const dispFx        = displacementFx[card.id]
              // Displacement overrides cloud opacity while a card is selected.
              const targetOpacity = dispFx ? dispFx.opacity : (card.ghosted ? 0.1 : cloudOpacity)
              const targetX       = dispFx?.x ?? 0
              const targetY       = dispFx?.y ?? 0
              const targetScale   = dispFx?.scale ?? 1
              const dealt         = idx < 9

              return (
                <motion.article
                  key={card.id}
                  ref={(el) => registerCardRef(card.id, el)}
                  layout
                  layoutId={`grid-${card.id}`}
                  onClick={() => handleCardClick(card.id)}
                  initial={dealt ? { opacity: 0, y: 24, scale: 0.98 } : false}
                  animate={{
                    opacity: targetOpacity,
                    x: targetX,
                    y: targetY,
                    scale: targetScale,
                  }}
                  transition={{
                    layout:   { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                    opacity:  dealt
                      ? { delay: idx * 0.055, duration: 0.32 }
                      : { duration: 0.24, ease: POWER4_OUT },
                    x:        { duration: 0.48, ease: POWER4_OUT },
                    y:        dealt
                      ? { delay: idx * 0.055, duration: 0.32 }
                      : { duration: 0.48, ease: POWER4_OUT },
                    scale:    { duration: 0.48, ease: POWER4_OUT },
                  }}
                  style={{
                    minHeight: 180,
                    borderRadius: 16,
                    border: `1px solid ${COLOR.border}`,
                    background: COLOR.surface,
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    padding: "1rem",
                    // Ghosted cards get a pointer-events:none so they don't
                    // interfere with the visible cards' click targets.
                    pointerEvents: card.ghosted ? "none" : "auto",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: card.type === "project" ? COLOR.project : COLOR.experience,
                    }}
                  >
                    {card.type}
                  </p>
                  <h3
                    style={{
                      marginTop: "0.45rem",
                      fontSize: "1rem",
                      lineHeight: 1.25,
                      color: COLOR.text,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ marginTop: "0.2rem", fontSize: "0.72rem", color: COLOR.subtext }}>
                    {card.meta}
                  </p>
                  <p
                    style={{
                      marginTop: "0.65rem",
                      fontSize: "0.78rem",
                      lineHeight: 1.45,
                      color: COLOR.dim,
                    }}
                  >
                    {card.description}
                  </p>
                </motion.article>
              )
            })}
          </motion.div>

          {/* ── Expanded "Secret Brick" modal ─────────────────────────── */}
          <AnimatePresence>
            {expandedSnapshot && (
              <ExpandedCard
                key={expandedSnapshot.id}
                card={expandedSnapshot}
                onClose={handleClose}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  )
}
