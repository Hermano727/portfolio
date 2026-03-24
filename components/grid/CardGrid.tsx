"use client"

import { motion } from "framer-motion"
import { Fragment, useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from "react"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { useApertureFilter, type ApertureCard, type ApertureFilter } from "./useApertureFilter"
import {
  usePuzzleEngine,
  SPRING,
  EASE_OUT,
  CARD_HEIGHT,
  cardWidth,
  type CardPhase,
  type PuzzleCardState,
} from "./CollisionEngine"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CardGridProps {
  dealSeed: number
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
// Aesthetic: soft dark panels that let the starfield network breathe through.
// Warm purple palette unified with the hero section.

const IND = {
  surface:         "rgba(10, 8, 14, 0.55)",
  surfaceExpanded: "rgba(8, 6, 12, 0.75)",
  textPrimary:     "rgba(255, 255, 255, 0.95)",
  textBody:        "rgba(255, 255, 255, 0.82)",
  textMuted:       "rgba(255, 255, 255, 0.45)",
  textDim:         "rgba(255, 255, 255, 0.25)",
  techSpec:        "rgba(224, 182, 255, 0.80)",
  accentExp:       "rgba(200, 180, 255, 0.75)",
  accentProj:      "#e0b6ff",
  tagBg:           "rgba(0, 0, 0, 0)",
  tagBorder:       "rgba(224, 182, 255, 0.25)",
} as const

const FONT_DISPLAY = "var(--font-archivo), 'Arial Black', sans-serif"
const FONT_MONO    = "var(--font-geist-mono), monospace"

// Safely applies an alpha to any rgba() or #rrggbb color string.
function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("rgba(")) {
    return color.replace(/[\d.]+\)$/, `${alpha})`)
  }
  if (color.startsWith("#")) {
    const h = color.slice(1)
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

// ─── Monitor Frame ────────────────────────────────────────────────────────────
// Insets its child into a 4px black gutter + scanline overlay.

function MonitorFrame({
  children,
  style: extraStyle,
}: {
  children: React.ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: 4,
        background: "#000",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        borderTop: "1px solid rgba(255, 255, 255, 0.22)",
        overflow: "hidden",
        boxSizing: "border-box",
        flexShrink: 0,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  )
}

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
          height: "1px",
          filter: "blur(2px)",
          background:
            "linear-gradient(to right, transparent, rgba(224,182,255,0.18) 45%, rgba(224,182,255,0.18) 55%, transparent)",
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
        gap: 4,
        background: "rgba(10, 8, 14, 0.70)",
        border: "1px solid rgba(224, 182, 255, 0.14)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 24,
        padding: "4px",
      }}
    >
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            style={{
              padding: "6px 20px",
              borderRadius: 20,
              border: "none",
              background: isActive ? "rgba(224, 182, 255, 0.12)" : "transparent",
              color: isActive ? "rgba(224, 182, 255, 0.95)" : "rgba(255, 255, 255, 0.38)",
              fontFamily: FONT_MONO,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.18s ease",
              outline: "none",
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Per-phase Framer Motion transition ──────────────────────────────────────

function getTransition(phase: CardPhase) {
  switch (phase) {
    case "sliding":
      return { duration: 0.6, ease: EASE_OUT }
    case "gutter":
      return SPRING
    case "returning":
      return SPRING
    default:
      return { duration: 0.7, ease: EASE_OUT }
  }
}

// ─── Compact Card Content ─────────────────────────────────────────────────────
// Portrait (imageType="portrait"): image fills left 42%, text fills right 58%.
// Landscape / no-image: CSS Grid with small right-side thumbnail.

function CardCompact({ card }: { card: ApertureCard }) {
  const [isPortrait, setIsPortrait] = useState(card.imageType === "portrait")
  const accent   = card.type === "project" ? IND.accentProj : IND.accentExp
  const hasImage = Boolean(card.image)

  function handleImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget
    setIsPortrait(naturalHeight > naturalWidth)
  }

  // ── Image layout: always show image as left column when image exists ─────────
  if (hasImage) {
    return (
      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
        {/* Left: full-height image strip */}
        <div
          style={{
            width: "42%",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img
            src={card.image}
            alt={card.title}
            draggable={false}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
              display: "block",
              filter: "sepia(0.15) brightness(0.85)",
            }}
            onLoad={handleImageLoad}
          />
        </div>

        {/* Right: label / title / meta / desc / tags */}
        <div
          style={{
            flex: 1,
            padding: "11px 10px 10px 10px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: FONT_MONO,
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {card.type}
          </span>

          <h3
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: IND.textPrimary,
              margin: "4px 0 0",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.title}
          </h3>

          <p
            style={{
              fontSize: "0.8rem",
              lineHeight: 1.55,
              color: IND.textBody,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              margin: "5px 0 0",
              flex: 1,
            }}
          >
            {card.description}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 4,
              overflow: "hidden",
              paddingTop: 6,
            }}
          >
            {card.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(224, 182, 255, 0.72)",
                  background: "transparent",
                  border: "1px solid rgba(224, 182, 255, 0.25)",
                  padding: "3px 9px",
                  borderRadius: 12,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Landscape / no-image layout: CSS Grid ─────────────────────────────────
  return (
    <div
      style={{
        height: "100%",
        display: "grid",
        gridTemplateColumns: hasImage ? "1fr 64px" : "1fr",
        gridTemplateRows: "18px minmax(52px, auto) 1fr 22px",
        gridTemplateAreas: hasImage
          ? `"label label" "title image" "desc image" "tags tags"`
          : `"label" "title" "desc" "tags"`,
        columnGap: 8,
        padding: "12px 12px 10px",
        overflow: "hidden",
      }}
    >
      {/* Label + meta */}
      <div
        style={{
          gridArea: "label",
          display: "flex",
          alignItems: "center",
          gap: 5,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          {card.type}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          gridArea: "title",
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          color: IND.textPrimary,
          margin: "4px 0 0",
          alignSelf: "start",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {card.title}
      </h3>

      {/* Landscape image thumbnail in Monitor frame */}
      {hasImage && (
        <div style={{ gridArea: "image", alignSelf: "stretch" }}>
          <MonitorFrame style={{ width: 56, height: "100%" }}>
            <img
              src={card.image}
              alt={card.title}
              draggable={false}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                filter: "sepia(0.2) brightness(0.8)",
              }}
              onLoad={handleImageLoad}
            />
          </MonitorFrame>
        </div>
      )}

      {/* Description */}
      <p
        style={{
          gridArea: "desc",
          fontSize: "0.8rem",
          lineHeight: 1.6,
          color: IND.textBody,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          margin: "5px 0 0",
          alignSelf: "start",
        }}
      >
        {card.description}
      </p>

      {/* Tags */}
      <div
        style={{
          gridArea: "tags",
          display: "flex",
          flexWrap: "nowrap",
          gap: 4,
          overflow: "hidden",
          alignSelf: "end",
        }}
      >
        {card.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(224, 182, 255, 0.72)",
              background: "transparent",
              border: "1px solid rgba(224, 182, 255, 0.25)",
              padding: "3px 9px",
              borderRadius: 12,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Expanded sub-components (shared between portrait and landscape layouts) ──

function ExpandedHeader({
  card,
  accent,
  style: xs,
}: {
  card: ApertureCard
  accent: string
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        padding: "0.8rem 3.2rem 0.7rem 0.95rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        ...xs,
      }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {card.type}
      </p>
      <h2
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginTop: "0.22rem",
          fontSize: "clamp(1.5rem, 3vw, 1.85rem)",
          lineHeight: 1.1,
          color: IND.textPrimary,
        }}
      >
        {card.title}
      </h2>
    </div>
  )
}

// ─── Easy-to-edit layout knobs ───────────────────────────────────────────────
const PORTRAIT_PANEL_WIDTH   = "38%"
const PORTRAIT_IMG_RATIO     = "3 / 4"
const LANDSCAPE_FRAME_HEIGHT = 120   // px
const PORTRAIT_FRAME_HEIGHT  = 200   // px (inline fallback, not used in panel mode)

// ─── WorkExamplesSection ─────────────────────────────────────────────────────
// Renders card.images with orientation-aware sizing.
// If overrideTypes is provided for an index, that wins over onLoad detection.
// When ALL images resolve as portrait → allPortrait=true; caller switches layout.

function WorkExamplesSection({
  images,
  overrideTypes,
  accent,
  isVisible,
  mode,
}: {
  images: string[]
  overrideTypes?: ("portrait" | "landscape")[]
  accent: string
  isVisible: boolean
  /** "panel" = stacked full-width inside a column; "inline" = current grid row */
  mode: "panel" | "inline"
}) {
  // Seed initial detection from overrideTypes; indices without an override start null.
  const [detected, setDetected] = useState<(boolean | null)[]>(
    () => images.map((_, i) =>
      overrideTypes?.[i] === "portrait" ? true :
      overrideTypes?.[i] === "landscape" ? false :
      null
    )
  )

  function handleLoad(e: SyntheticEvent<HTMLImageElement>, i: number) {
    if (overrideTypes?.[i] != null) return // override wins, skip detection
    const { naturalWidth, naturalHeight } = e.currentTarget
    setDetected(prev => {
      const next = [...prev]
      next[i] = naturalHeight > naturalWidth
      return next
    })
  }

  const resolvedPortrait = images.map((_, i) =>
    overrideTypes?.[i] === "portrait" ? true :
    overrideTypes?.[i] === "landscape" ? false :
    (detected[i] ?? false)
  )

  if (mode === "panel") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              width: "100%",
              aspectRatio: resolvedPortrait[i] ? PORTRAIT_IMG_RATIO : "16 / 9",
              overflow: "hidden",
              borderRadius: 8,
              background: "#000",
            }}
          >
            <img
              src={src}
              alt={`example ${i + 1}`}
              draggable={false}
              loading="lazy"
              onLoad={(e) => handleLoad(e, i)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // ── inline mode ─────────────────────────────────────────────────────────
  return (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ delay: isVisible ? 0.5 : 0, duration: 0.3, ease: EASE_OUT }}
      style={{ marginTop: "1.1rem" }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: withAlpha(accent, 0.5),
          marginBottom: "0.5rem",
        }}
      >
        Work Examples
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(images.length, 2)}, 1fr)`,
          gap: "0.45rem",
        }}
      >
        {images.map((src, i) =>
          resolvedPortrait[i] ? (
            // Portrait: fixed height, cover crop
            <MonitorFrame key={i} style={{ height: PORTRAIT_FRAME_HEIGHT }}>
              <img
                src={src}
                alt={`example ${i + 1}`}
                draggable={false}
                loading="lazy"
                onLoad={(e) => handleLoad(e, i)}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </MonitorFrame>
          ) : (
            // Landscape: natural proportions — no fixed height, full image visible
            <div
              key={i}
              style={{
                width: "100%",
                overflow: "hidden",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "#000",
              }}
            >
              <img
                src={src}
                alt={`example ${i + 1}`}
                draggable={false}
                loading="lazy"
                onLoad={(e) => handleLoad(e, i)}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          )
        )}
      </div>
    </motion.div>
  )
}

function ExpandedBody({
  card,
  isVisible,
  accent,
  pad = "1rem 1.1rem 1.3rem",
}: {
  card: ApertureCard
  isVisible: boolean
  accent: string
  pad?: string
}) {
  const workImages = card.images ?? []

  // Track portrait orientation per work example.
  // Seed from workExampleTypes override if available; otherwise default false (landscape)
  // and update via onLoad detection.
  const [workPortrait, setWorkPortrait] = useState<boolean[]>(
    () => workImages.map((_, i) =>
      card.workExampleTypes?.[i] === "portrait" ? true :
      card.workExampleTypes?.[i] === "landscape" ? false :
      false
    )
  )

  function handleWorkExLoad(e: SyntheticEvent<HTMLImageElement>, i: number) {
    if (card.workExampleTypes?.[i] != null) return // override wins, skip
    const { naturalWidth, naturalHeight } = e.currentTarget
    setWorkPortrait(prev => {
      const next = [...prev]
      next[i] = naturalHeight > naturalWidth
      return next
    })
  }

  const allWorkPortrait =
    workImages.length > 0 && workPortrait.every(Boolean)

  // ── Shared sub-renders ───────────────────────────────────────────────────

  const highlightsBlock = card.highlights.length > 0 && (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 8 }}
      transition={{ delay: isVisible ? 0.4 : 0, duration: 0.3, ease: EASE_OUT }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: withAlpha(accent, 0.5),
          marginBottom: "0.5rem",
        }}
      >
        Highlights
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {card.highlights.map((h, i) => (
          <motion.li
            key={i}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -8 }}
            transition={{ delay: isVisible ? 0.4 + i * 0.06 : 0, duration: 0.25, ease: EASE_OUT }}
            style={{
              display: "flex",
              gap: "0.55rem",
              fontSize: "0.875rem",
              lineHeight: 1.65,
              color: IND.textBody,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                marginTop: "0.56rem",
                width: 3,
                height: 3,
                background: accent,
                borderRadius: 0,
              }}
            />
            {h}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )

  const demoBlock = card.youtubeId && (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 10 }}
      transition={{ delay: isVisible ? 0.55 : 0, duration: 0.3, ease: EASE_OUT }}
      style={{ marginTop: "1.1rem" }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: withAlpha(accent, 0.5),
          marginBottom: "0.5rem",
        }}
      >
        Demo
      </p>
      <a
        href={`https://youtube.com/watch?v=${card.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ display: "block", textDecoration: "none" }}
      >
        <MonitorFrame style={{ height: 120 }}>
          <img
            src={`https://img.youtube.com/vi/${card.youtubeId}/hqdefault.jpg`}
            alt="YouTube demo"
            draggable={false}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.22)",
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 2,
                borderTop: "1px solid rgba(255,255,255,0.28)",
                borderRight: "1px solid rgba(255,255,255,0.10)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                borderLeft: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                color: "#fff",
                fontFamily: FONT_MONO,
              }}
            >
              ▶
            </div>
          </div>
        </MonitorFrame>
      </a>
    </motion.div>
  )

  const descBlock = (
    <p
      style={{
        marginTop: "1.1rem",
        fontSize: "0.9375rem",
        lineHeight: 1.7,
        color: IND.textBody,
      }}
    >
      {card.description}
    </p>
  )

  const tagsBlock = card.tags.length > 0 && (
    <div style={{ marginTop: "0.9rem" }}>
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(224, 182, 255, 0.45)",
          marginBottom: "0.45rem",
        }}
      >
        Tech Stack
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {card.tags.slice(0, 12).map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 10,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(224, 182, 255, 0.72)",
              background: "transparent",
              border: "1px solid rgba(224, 182, 255, 0.25)",
              padding: "3px 9px",
              borderRadius: 12,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )

  const linksBlock = (card.githubUrl || card.liveUrl) && (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ delay: isVisible ? 0.6 : 0, duration: 0.25, ease: EASE_OUT }}
      style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
    >
      {card.githubUrl && (
        <a
          href={card.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.9rem",
            borderRadius: 2,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            borderLeft: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.04)",
            color: IND.textBody,
            fontFamily: FONT_MONO,
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          ⌥ GitHub
        </a>
      )}
      {card.liveUrl && (
        <a
          href={card.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.3rem 0.9rem",
            borderRadius: 2,
            borderTop: `1px solid ${withAlpha(accent, 0.40)}`,
                borderRight: `1px solid ${withAlpha(accent, 0.14)}`,
                borderBottom: `1px solid ${withAlpha(accent, 0.07)}`,
                borderLeft: `1px solid ${withAlpha(accent, 0.14)}`,
                background: withAlpha(accent, 0.08),
            color: accent,
            fontFamily: FONT_MONO,
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          ▶ {card.type === "experience" ? "Watch" : "Live Demo"}
        </a>
      )}
    </motion.div>
  )

  // ── Portrait panel layout: images on left, text on right ─────────────────
  // Triggered when all work examples resolve as portrait orientation.
  if (allWorkPortrait) {
    return (
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: portrait images stacked, scrollable */}
        <div
          style={{
            width: PORTRAIT_PANEL_WIDTH,
            flexShrink: 0,
            overflowY: "auto",
            padding: "0.75rem",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {workImages.map((src, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                aspectRatio: PORTRAIT_IMG_RATIO,
                overflow: "hidden",
                borderRadius: 8,
                background: "#000",
                flexShrink: 0,
              }}
            >
              <img
                src={src}
                alt={`${card.title} example ${i + 1}`}
                draggable={false}
                loading="lazy"
                onLoad={(e) => handleWorkExLoad(e, i)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>

        {/* Right: all text content, scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: pad }}>
          {highlightsBlock}
          {demoBlock}
          {descBlock}
          {tagsBlock}
          {linksBlock}
        </div>
      </div>
    )
  }

  // ── Default stacked layout ────────────────────────────────────────────────
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: pad }}>
      {highlightsBlock}

      {/* Work examples inline */}
      {workImages.length > 0 && (
        <WorkExamplesSection
          images={workImages}
          overrideTypes={card.workExampleTypes}
          accent={accent}
          isVisible={isVisible}
          mode="inline"
        />
      )}

      {demoBlock}
      {descBlock}
      {tagsBlock}
      {linksBlock}
    </div>
  )
}

// ─── Expanded Card Content ────────────────────────────────────────────────────
// Portrait → image side-panel left 40%, scrollable content right 60%.
// Landscape → cinematic hero on top (150px), content below.

function CardExpanded({
  card,
  onClose,
  isVisible,
}: {
  card: ApertureCard
  onClose: () => void
  isVisible: boolean
}) {
  const [isPortrait, setIsPortrait] = useState(card.imageType === "portrait")
  const accent  = card.type === "experience" ? IND.accentExp : IND.accentProj
  const hasHero = Boolean(card.image)

  function handleImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget
    setIsPortrait(naturalHeight > naturalWidth)
  }

  const closeBtn = (
    <button
      onClick={(e) => { e.stopPropagation(); onClose() }}
      aria-label="Close"
      style={{
        position: "absolute",
        top: "0.7rem",
        right: "0.7rem",
        width: 28,
        height: 28,
        borderRadius: 2,
        borderTop: "1px solid rgba(255,255,255,0.26)",
        borderRight: "1px solid rgba(255,255,255,0.09)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        borderLeft: "1px solid rgba(255,255,255,0.09)",
        background: "rgba(0,0,0,0.65)",
        color: "rgba(255,255,255,0.65)",
        fontSize: "0.72rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 60,
        transition: "all 0.15s ease",
        flexShrink: 0,
        fontFamily: FONT_MONO,
      }}
    >
      ✕
    </button>
  )

  // ── Portrait: side-panel layout ────────────────────────────────────────────
  if (isPortrait && hasHero) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {closeBtn}

        {/* Left: full-height portrait image in Monitor frame */}
        <div style={{ width: "40%", flexShrink: 0 }}>
          <MonitorFrame
            style={{
              height: "100%",
              width: "100%",
              borderLeft: "none",
              borderTop: "none",
              borderBottom: "none",
              borderRight: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              draggable={false}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
              }}
              onLoad={handleImageLoad}
            />
          </MonitorFrame>
        </div>

        {/* Right: header + scrollable body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ExpandedHeader card={card} accent={accent} />
          <ExpandedBody
            card={card}
            isVisible={isVisible}
            accent={accent}
            pad="0.9rem 1rem 1.3rem 0.9rem"
          />
        </div>
      </div>
    )
  }

  // ── Landscape / no-image: stacked layout ──────────────────────────────────
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {closeBtn}

      {hasHero ? (
        <div style={{ flexShrink: 0 }}>
          {/* Cinematic hero — natural aspect ratio up to 220px so the image isn't clipped */}
          <div
            style={{
              padding: 4,
              background: "#000",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div style={{ position: "relative", maxHeight: 220, overflow: "hidden" }}>
              <img
                src={card.image}
                alt={card.title}
                draggable={false}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
                onLoad={handleImageLoad}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.3) 60%, transparent 100%)",
                }}
              />
            </div>
          </div>
          <ExpandedHeader card={card} accent={accent} />
        </div>
      ) : (
        <ExpandedHeader
          card={card}
          accent={accent}
          style={{
            borderTop: `2px solid ${withAlpha(accent, 0.55)}`,
            padding: "1.2rem 3.2rem 0.9rem 0.95rem",
          }}
        />
      )}

      <ExpandedBody card={card} isVisible={isVisible} accent={accent} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardGrid({ dealSeed }: CardGridProps) {
  const { setLeftFocusedIndex, setCardExpanded } = useScrollOrchestrator()
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize({ w: width, h: height })
    })
    ro.observe(container)
    setContainerSize({ w: container.clientWidth, h: container.clientHeight })
    return () => ro.disconnect()
  }, [])

  const { filter, setFilter, orderedCards } = useApertureFilter()
  const { cardStates, activeId, isExpanded, activateCard, closeActive } =
    usePuzzleEngine(orderedCards, containerRef)

  const [hasDealt, setHasDealt] = useState(false)
  const prevDealSeedRef = useRef(dealSeed)
  useEffect(() => {
    if (dealSeed !== prevDealSeedRef.current || !hasDealt) {
      prevDealSeedRef.current = dealSeed
      setHasDealt(false)
      const t = setTimeout(() => setHasDealt(true), 50)
      return () => clearTimeout(t)
    }
  }, [dealSeed, hasDealt])

  useEffect(() => {
    setCardExpanded(isExpanded)
  }, [isExpanded, setCardExpanded])

  useEffect(() => {
    setLeftFocusedIndex(0)
  }, [setLeftFocusedIndex])

  const { w: cW, h: cH } = containerSize
  const expandedW = Math.round(cW * 0.75)
  const expandedH = Math.round(cH * 0.75)
  const expandedX = Math.round((cW - expandedW) / 2)
  const expandedY = Math.round((cH - expandedH) / 2)

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "100vh", overflow: "hidden", zIndex: 10, background: "transparent" }}
    >
      {/* Darkened horizon — seamless bleed from hero starfield */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: "radial-gradient(circle at top, rgba(21, 19, 20, 0) 0%, #151314 90%)",
        }}
      />
      <CloudBank side="top" />
      <CloudBank side="bottom" />

      {/* Filter bar */}
      <div
        style={{
          position: "absolute",
          top: "10vh",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 31,
          pointerEvents: activeId ? "none" : "auto",
          opacity: activeId ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}
      >
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {/* ── Puzzle Cards ──────────────────────────────────────────────────── */}
      {orderedCards.map((card, idx) => {
        const state = cardStates[card.id] as PuzzleCardState | undefined
        if (!state) return null

        const isActive     = card.id === activeId
        const showExpanded = isActive && isExpanded

        const targetX = showExpanded ? expandedX : state.x
        const targetY = showExpanded ? expandedY : state.y
        const targetW = showExpanded ? expandedW : state.width
        const targetH = showExpanded ? expandedH : state.height

        const xyTransition = getTransition(state.phase)
        const dealDelay    = idx * 0.055

        return (
          <Fragment key={card.id}>
            <motion.article
              onClick={() => {
                if (!isActive && !activeId) activateCard(card.id)
              }}
              initial={
                !hasDealt
                  ? { opacity: 0, y: state.y + 24, x: state.x, scale: 0.98 }
                  : false
              }
              animate={{
                x:          targetX,
                y:          targetY,
                width:      targetW,
                height:     targetH,
                opacity:    state.opacity,
                scale:      1,
                background: showExpanded ? IND.surfaceExpanded : IND.surface,
              }}
              transition={{
                x:          xyTransition,
                y:          !hasDealt
                  ? { delay: dealDelay, duration: 0.32 }
                  : xyTransition,
                opacity:    !hasDealt
                  ? { delay: dealDelay, duration: 0.32 }
                  : { duration: 0.3, ease: EASE_OUT },
                background: { duration: 0.45, ease: EASE_OUT },
                width:      showExpanded
                  ? { duration: 0.45, ease: EASE_OUT }
                  : state.phase === "returning"
                    ? SPRING
                    : { duration: 0.44, ease: EASE_OUT },
                height:     showExpanded
                  ? { duration: 0.45, ease: EASE_OUT }
                  : state.phase === "returning"
                    ? SPRING
                    : { duration: 0.44, ease: EASE_OUT },
                scale:      !hasDealt
                  ? { delay: dealDelay, duration: 0.32 }
                  : { duration: 0.32 },
              }}
              style={{
                position:             state.phase === "gutter" ? "fixed" : "absolute",
                left:                 0,
                top:                  0,
                minHeight:            CARD_HEIGHT,
                borderRadius:         16,
                border:               "1px solid rgba(224, 182, 255, 0.12)",
                backdropFilter:       "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                cursor:               isActive ? "default" : "pointer",
                overflow:             "hidden",
                zIndex:               state.zIndex,
                filter:               state.filter,
                pointerEvents:        state.phase === "gutter" ? "none" : "auto",
              }}
            >
              {/* ── Compact layer — fades out when card expands ── */}
              <motion.div
                animate={{ opacity: showExpanded ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: showExpanded ? "none" : "auto",
                }}
              >
                <CardCompact card={card} />
              </motion.div>

              {/* ── Expanded layer — always mounted, fades in via isVisible ── */}
              <motion.div
                animate={{ opacity: showExpanded ? 1 : 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: showExpanded ? "auto" : "none",
                }}
              >
                <CardExpanded card={card} onClose={closeActive} isVisible={showExpanded} />
              </motion.div>
            </motion.article>

            {/* ── Hornet easter egg — sibling to article so overflow:hidden can't clip her ── */}
            {card.id === "proj-echoes-of-pharloom" && (
              <motion.img
                src="/assets/hornet_sitting.png"
                aria-hidden="true"
                draggable={false}
                initial={
                  !hasDealt
                    ? { opacity: 0, y: state.y + 24 - 32, x: state.x + state.width - 55 - 16, scale: 0.98 }
                    : false
                }
                animate={{
                  x:       targetX + targetW - 55 - 16,
                  y:       targetY - 32,
                  opacity: state.opacity,
                  scale:   1,
                }}
                transition={{
                  x:       xyTransition,
                  y:       !hasDealt
                    ? { delay: dealDelay, duration: 0.32 }
                    : xyTransition,
                  opacity: !hasDealt
                    ? { delay: dealDelay, duration: 0.32 }
                    : { duration: 0.3, ease: EASE_OUT },
                  scale:   !hasDealt
                    ? { delay: dealDelay, duration: 0.32 }
                    : { duration: 0.32 },
                }}
                style={{
                  position:      "absolute",
                  left:          -20,
                  top:           -60,
                  width:         105,
                  height:        "auto",
                  zIndex:        state.zIndex + 1,
                  pointerEvents: "none",
                  filter:        "drop-shadow(0 8px 6px rgba(247, 242, 242, 0.2))",
                }}
              />
            )}
          </Fragment>
        )
      })}

      {/* ── Click-away when a card is expanded ── */}
      {isExpanded && (
        <div
          onClick={closeActive}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            cursor: "pointer",
          }}
        />
      )}
    </div>
  )
}
