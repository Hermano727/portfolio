"use client"

import { AnimatePresence, motion, useTransform, type MotionValue } from "framer-motion"
import Image from "next/image"
import { EASE_DECK } from "@/lib/motion"

// ── Design tokens ────────────────────────────────────────────────────────────

const T = {
  surfaceLow:          "#1d1b1c",
  surfaceHigh:         "#2b2829",
  surfaceHighest:      "#373435",
  primary:             "#e0b6ff",
  primaryContainer:    "157,78,221",   // rgb only
  onSurface:           "#f4edf8",
  onSurfaceVariant:    "#d0c2d5",
  outlineVariant:      "74,66,73",
} as const

// ── Types ────────────────────────────────────────────────────────────────────

export interface DeckCardModel {
  id: string
  title: string
  meta?: string
  hook?: string
  bullets?: string[]
  image?: string
  tags?: string[]
  liveUrl?: string
  /**
   * 'featured' → subtle purple-tinted accent for standout projects.
   * Omit or undefined → standard atmospheric card.
   */
  variant?: "featured"
}

export interface DeckCardProps {
  card: DeckCardModel
  index: number
  containerRef: React.RefObject<HTMLElement | null>
  focusedIndex: MotionValue<number>
  register: (index: number) => (el: HTMLDivElement | null) => void
  isExpanded?: boolean
  isPeek?: boolean
  onExpand?: () => void
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

export default function DeckCard({
  card,
  index,
  containerRef,
  focusedIndex,
  register,
  isExpanded = false,
  isPeek = false,
  onExpand,
}: DeckCardProps) {
  // ── Depth motion values — fade/blur unfocused cards ──────────────────────────
  const opacity = useTransform(focusedIndex, (fi) => {
    const dist = Math.abs(fi - index)
    const t = clamp01(dist / 2.5)
    return 1 - t * 0.65 // 1 → 0.35
  })

  const blurPx = useTransform(focusedIndex, (fi) => {
    const dist = Math.abs(fi - index)
    return dist === 0 ? 0 : Math.min(6, dist * 2)
  })

  const scale = useTransform(focusedIndex, (fi) => {
    const dist = Math.abs(fi - index)
    if (dist === 0) return 1.0
    if (dist === 1) return 0.985
    return 0.972
  })

  const filter = useTransform(blurPx, (b) => `blur(${b.toFixed(2)}px)`)

  const isFeatured = card.variant === "featured"
  const expandTransition = { duration: 0.32, ease: EASE_DECK }

  return (
    <motion.div
      ref={register(index)}
      initial={{ opacity: 0, y: -18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ root: containerRef, once: true, amount: 0.1 }}
      transition={{ duration: 0.38, ease: EASE_DECK }}
      style={{ scale, filter }}
      className={[
        "relative will-change-transform",
        isPeek ? "opacity-50" : "",
      ].filter(Boolean).join(" ")}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) return
          onExpand?.()
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onExpand?.()
          }
        }}
        animate={
          isExpanded
            ? { backgroundColor: `rgba(${T.outlineVariant},0.18)` }
            : { backgroundColor: "rgba(0,0,0,0)" }
        }
        transition={expandTransition}
        className={[
          "cursor-pointer select-none outline-none",
          "rounded-xl",
          "px-5 py-4",
          // Ghost border per design spec: visible only when focused/expanded
          "focus-visible:ring-1 focus-visible:ring-[rgba(224,182,255,0.35)]",
          // Very subtle border that doesn't define sharp geometry
          isExpanded
            ? "border border-[rgba(74,66,73,0.22)]"
            : "border border-transparent",
        ].join(" ")}
        style={{
          opacity,
          // Left-side accent glow for the featured variant
          ...(isFeatured && isExpanded
            ? { borderLeft: `2px solid rgba(${T.primaryContainer},0.5)` }
            : {}),
        }}
      >
        {/* ── Left accent bar for focused card ── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="accent"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-hidden="true"
              style={{
                position:    "absolute",
                left:        0,
                top:         "12%",
                bottom:      "12%",
                width:       "2px",
                borderRadius: "9999px",
                background:  isFeatured
                  ? `linear-gradient(to bottom, transparent, rgba(${T.primaryContainer},0.7), transparent)`
                  : `linear-gradient(to bottom, transparent, rgba(224,182,255,0.45), transparent)`,
                transformOrigin: "top",
              }}
            />
          )}
        </AnimatePresence>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ minWidth: 0 }}>
            <h3
              style={{
                fontSize:      "0.92rem",
                fontFamily:    "var(--font-space-grotesk), var(--font-geist-sans), sans-serif",
                fontWeight:    600,
                letterSpacing: "-0.01em",
                color:         T.onSurface,
                opacity:       0.92,
              }}
            >
              {card.title}
            </h3>
            {card.meta ? (
              <p
                style={{
                  marginTop:     "0.25rem",
                  fontSize:      "0.66rem",
                  fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
                  fontWeight:    600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         isFeatured ? T.primary : `rgba(${T.primaryContainer},0.85)`,
                }}
              >
                {card.meta}
              </p>
            ) : null}
          </div>

          <div style={{ display: "flex", flexShrink: 0, alignItems: "center", gap: "0.5rem", marginTop: "0.1rem" }}>
            {card.liveUrl ? (
              <a
                href={card.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  borderRadius:  "0.25rem",
                  border:        `1px solid rgba(${T.outlineVariant},0.3)`,
                  padding:       "0.15rem 0.5rem",
                  fontSize:      "0.6rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color:         `rgba(208,194,213,0.55)`,
                  transition:    "border-color 0.15s, color 0.15s",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = T.primary
                  e.currentTarget.style.borderColor = `rgba(${T.primaryContainer},0.5)`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "rgba(208,194,213,0.55)"
                  e.currentTarget.style.borderColor = `rgba(${T.outlineVariant},0.3)`
                }}
              >
                Live ↗
              </a>
            ) : null}

            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              aria-hidden="true"
              style={{
                fontSize: "0.7rem",
                color:    `rgba(${T.outlineVariant},0.7)`,
              }}
            >
              ↓
            </motion.span>
          </div>
        </div>

        {/* ── Hook ── */}
        {card.hook ? (
          <p
            style={{
              marginTop:   "0.625rem",
              fontSize:    "0.79rem",
              lineHeight:  1.65,
              color:       `rgba(208,194,213,0.62)`,
              fontFamily:  "var(--font-manrope), var(--font-geist-sans), sans-serif",
            }}
          >
            {card.hook}
          </p>
        ) : null}

        {/* ── Tags — pill stones per design spec ── */}
        {card.tags?.length ? (
          <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {card.tags.slice(0, 6).map((t) => (
              <span
                key={t}
                style={{
                  borderRadius:  "9999px",
                  background:    `rgba(${T.outlineVariant},0.22)`,
                  padding:       "0.2rem 0.6rem",
                  fontSize:      "0.62rem",
                  fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
                  color:         `rgba(208,194,213,0.6)`,
                  letterSpacing: "0.04em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {/* ── Expandable: image + bullets ── */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="expanded-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={expandTransition}
              style={{ overflow: "hidden" }}
            >
              {card.image ? (
                <div style={{ marginTop: "0.875rem", position: "relative", height: "7rem", borderRadius: "0.5rem", overflow: "hidden" }}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    style={{ opacity: 0.72, filter: "saturate(0.8)" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div
                    style={{
                      position:   "absolute",
                      inset:      0,
                      background: `linear-gradient(to top, rgba(21,19,20,0.7) 0%, transparent 60%)`,
                    }}
                  />
                </div>
              ) : null}

              {card.bullets?.length ? (
                <ul style={{ marginTop: "0.875rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {card.bullets.slice(0, 3).map((b, i) => (
                    <li
                      key={i}
                      style={{
                        display:    "flex",
                        gap:        "0.5rem",
                        fontSize:   "0.77rem",
                        lineHeight: 1.55,
                        color:      `rgba(208,194,213,0.7)`,
                        fontFamily: "var(--font-manrope), var(--font-geist-sans), sans-serif",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          marginTop:  "0.05em",
                          flexShrink: 0,
                          color:      `rgba(${T.primaryContainer},0.65)`,
                        }}
                      >
                        ›
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
