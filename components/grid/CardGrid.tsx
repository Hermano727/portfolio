"use client"

import { motion } from "framer-motion"
import { jumpNavPillClassName } from "@/components/nav/jumpNavStyles"
import { EASE_DECK } from "@/lib/motion"
import { Github } from "lucide-react"
import { Fragment, useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from "react"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { isTypingTarget } from "@/lib/dom"
import { useApertureFilter, type ApertureCard, type ApertureFilter } from "./useApertureFilter"
import {
  usePuzzleEngine,
  SPRING,
  EASE_OUT,
  CARD_HEIGHT,
  TOP_PAD_RATIO,
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

/** Preview row: experience vs project label colors */
const TYPE_LABEL_PROJECT    = "rgba(236, 195, 255, 0.96)"
const TYPE_LABEL_EXPERIENCE = "rgba(158, 218, 255, 0.92)"
const TYPE_LABEL_FONT_PX    = 11
const TIMELINE_PREVIEW_PX   = 10

function typeLabelColor(card: { type: "experience" | "project" }) {
  return card.type === "project" ? TYPE_LABEL_PROJECT : TYPE_LABEL_EXPERIENCE
}

/** Compact + expanded header: "PROJECT" / "EXPERIENCE" left, timeline right */
function TypeTimelinePreview({
  card,
  variant = "compact",
  /** Expanded header shows timeline next to title instead */
  showTimeline = true,
}: {
  card: ApertureCard
  variant?: "compact" | "expanded"
  showTimeline?: boolean
}) {
  const typePx = variant === "expanded" ? 12 : TYPE_LABEL_FONT_PX
  const timePx = variant === "expanded" ? 11 : TIMELINE_PREVIEW_PX
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 8,
        width: "100%",
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: typePx,
          letterSpacing: variant === "expanded" ? "0.16em" : "0.14em",
          textTransform: "uppercase",
          color: typeLabelColor(card),
          flexShrink: 0,
        }}
      >
        {card.type}
      </span>
      {showTimeline && card.timeline && (
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: timePx,
            letterSpacing: "0.03em",
            color: "rgba(255, 255, 255, 0.38)",
            textAlign: "right",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.timeline}
        </span>
      )}
    </div>
  )
}

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
        height: "15vh",
        zIndex: 30,
        background: isTop
          ? "linear-gradient(to bottom, rgba(21,19,20,0.62), rgba(21,19,20,0.42) 52%, rgba(21,19,20,0.08) 88%, transparent)"
          : "linear-gradient(to top, rgba(21,19,20,0.52), rgba(21,19,20,0.22) 52%, rgba(21,19,20,0.08) 88%, transparent)",
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
const FILTER_EXIT_MS = 190
const FILTER_CLOSE_MS = 360

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
        borderRadius: 20,
        padding: "3px",
      }}
    >
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive = active === value
        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            style={{
              padding: "5px 16px",
              borderRadius: 18,
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
// Portrait (imageType="portrait"): image fills left ~38%, text fills right ~62%.
// Landscape / no-image: CSS Grid with small right-side thumbnail.
// Headline = employer or project name; secondary = role or categories; then type + timeline.

function cardImageAlt(card: ApertureCard): string {
  return card.meta ? `${card.title} — ${card.meta}` : card.title
}

/** Muted stack / tool tags — calmer than high-contrast lavender pills */
const TAG_PILL_COMPACT: CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: 10,
  fontWeight: 450,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.45)",
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.14)",
  padding: "3px 9px",
  borderRadius: 12,
  whiteSpace: "nowrap",
  flexShrink: 0,
}

const TAG_PILL_HEADER: CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: 9,
  fontWeight: 450,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.45)",
  background: "transparent",
  border: "1px solid rgba(255, 255, 255, 0.14)",
  padding: "2px 8px",
  borderRadius: 12,
}

/** Compact grid preview — first bullet max 2 lines, rest 1 line (matches card chrome height) */
function PreviewBullets({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null
  return (
    <ul
      style={{
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        alignSelf: "stretch",
        minWidth: 0,
        flexShrink: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {bullets.map((text, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 6,
            alignItems: "flex-start",
            fontSize: "0.78rem",
            lineHeight: 1.45,
            color: IND.textBody,
            minWidth: 0,
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              flexShrink: 0,
              width: 3,
              height: 3,
              marginTop: "0.38rem",
              background: "rgba(224, 182, 255, 0.38)",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: i === 0 ? 2 : 1,
            }}
          >
            {text}
          </span>
        </li>
      ))}
    </ul>
  )
}

function CardCompact({ card }: { card: ApertureCard }) {
  const hasImage = Boolean(card.image)
  const thumbPos = card.thumbnailObjectPosition ?? "top"

  // ── Image layout: always show image as left column when image exists ─────────
  if (hasImage) {
    return (
      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
        {/* Left: full-height image strip */}
        <div
          style={{
            width: "38%",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img
            src={card.image}
            alt={cardImageAlt(card)}
            draggable={false}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: thumbPos,
              display: "block",
              filter: "sepia(0.15) brightness(0.85)",
            }}
          />
        </div>

        {/* Right: employer/project → role/categories → type · timeline → desc → tags */}
        <div
          style={{
            flex: 1,
            padding: "11px 10px 10px 10px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <h3
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: "1.06rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: IND.textPrimary,
              margin: 0,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.title}
          </h3>

          {card.meta ? (
            <p
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                color: "rgba(200, 196, 232, 0.86)",
                margin: "4px 0 0",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {card.meta}
            </p>
          ) : null}

          <div style={{ marginTop: 8, flexShrink: 0 }}>
            <TypeTimelinePreview card={card} />
          </div>

          <div
            style={{
              marginTop: 6,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <PreviewBullets bullets={card.previewBullets} />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: 4,
              overflow: "hidden",
              paddingTop: 6,
              flexShrink: 0,
            }}
          >
            {card.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={TAG_PILL_COMPACT}>
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
        gridTemplateRows: "minmax(56px, auto) 1fr 22px",
        gridTemplateAreas: hasImage
          ? `"stack image" "desc image" "tags tags"`
          : `"stack" "desc" "tags"`,
        columnGap: 8,
        padding: "12px 12px 10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          gridArea: "stack",
          minWidth: 0,
          alignSelf: "start",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: "1.06rem",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: IND.textPrimary,
            margin: 0,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {card.title}
        </h3>
        {card.meta ? (
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: "rgba(200, 196, 232, 0.86)",
              margin: "4px 0 0",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {card.meta}
          </p>
        ) : null}
        <div style={{ marginTop: 8, width: "100%" }}>
          <TypeTimelinePreview card={card} />
        </div>
      </div>

      {/* Landscape image thumbnail in Monitor frame */}
      {hasImage && (
        <div style={{ gridArea: "image", alignSelf: "stretch" }}>
          <MonitorFrame style={{ width: 56, height: "100%" }}>
            <img
              src={card.image}
              alt={cardImageAlt(card)}
              draggable={false}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: thumbPos,
                display: "block",
                filter: "sepia(0.2) brightness(0.8)",
              }}
            />
          </MonitorFrame>
        </div>
      )}

      {/* Preview bullets */}
      <div
        style={{
          gridArea: "desc",
          margin: "8px 0 0",
          alignSelf: "stretch",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PreviewBullets bullets={card.previewBullets} />
      </div>

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
          <span key={tag} style={TAG_PILL_COMPACT}>
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
  const hasLinks = Boolean(card.githubUrl || card.liveUrl)
  return (
    <div
      style={{
        padding: "0.8rem 0.95rem 0.85rem 0.95rem",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        ...xs,
      }}
    >
      {/* Left: employer/project → role/categories → type · timeline → tags */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: 0,
            fontSize: "clamp(1.5rem, 3vw, 1.85rem)",
            lineHeight: 1.1,
            color: IND.textPrimary,
          }}
        >
          {card.title}
        </h2>
        {card.meta ? (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: "clamp(0.92rem, 2vw, 1.02rem)",
              fontWeight: 600,
              letterSpacing: "-0.015em",
              lineHeight: 1.35,
              color: "rgba(200, 196, 232, 0.88)",
            }}
          >
            {card.meta}
          </p>
        ) : null}
        <div style={{ marginTop: 12 }}>
          <TypeTimelinePreview card={card} variant="expanded" showTimeline />
        </div>
        {card.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.55rem" }}>
            {card.tags.slice(0, 12).map((tag) => (
              <span key={tag} style={TAG_PILL_HEADER}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Right: action buttons */}
      {hasLinks && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            flexShrink: 0,
            paddingTop: "0.1rem",
          }}
        >
          {card.githubUrl && (
            <a
              href={card.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="GitHub"
              title="GitHub"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 4,
                borderTop: "1px solid rgba(255,255,255,0.22)",
                borderRight: "1px solid rgba(255,255,255,0.09)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                borderLeft: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.06)",
                color: IND.textBody,
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <Github size={20} strokeWidth={1.5} />
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
                gap: "0.45rem",
                height: 44,
                padding: "0 1.1rem",
                borderRadius: 4,
                borderTop: `1px solid ${withAlpha(accent, 0.45)}`,
                borderRight: `1px solid ${withAlpha(accent, 0.16)}`,
                borderBottom: `1px solid ${withAlpha(accent, 0.08)}`,
                borderLeft: `1px solid ${withAlpha(accent, 0.16)}`,
                background: withAlpha(accent, 0.10),
                color: accent,
                fontFamily: FONT_MONO,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              ▶ {card.type === "experience" ? "Watch" : "Live"}
            </a>
          )}
        </div>
      )}
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
  captions,
  accent,
  isVisible,
  mode,
}: {
  images: string[]
  overrideTypes?: ("portrait" | "landscape")[]
  captions?: string[]
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
          fontSize: 20,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(224, 182, 255, 0.88)",
          marginBottom: "0.65rem",
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
        {images.map((src, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {resolvedPortrait[i] ? (
              <MonitorFrame style={{ height: PORTRAIT_FRAME_HEIGHT }}>
                <img
                  src={src}
                  alt={captions?.[i] ?? `example ${i + 1}`}
                  draggable={false}
                  loading="lazy"
                  onLoad={(e) => handleLoad(e, i)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </MonitorFrame>
            ) : (
              <div
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
                  alt={captions?.[i] ?? `example ${i + 1}`}
                  draggable={false}
                  loading="lazy"
                  onLoad={(e) => handleLoad(e, i)}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            )}
            {captions?.[i] && (
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  color: "rgba(200, 178, 245, 0.82)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {captions[i]}
              </p>
            )}
          </div>
        ))}
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

  /** SWEMaxx work screenshots live in the right side panel (full visibility) */
  const workExamplesInSidePanel = card.id === "proj-swemaxx"

  // ── Shared sub-renders ───────────────────────────────────────────────────
  const contextRows = [
    { label: "Problem", value: card.contextProblem || card.description },
    { label: "When", value: card.contextWhen || card.timeline || "" },
    { label: "Where", value: card.contextWhere || "" },
    { label: "Stack", value: card.contextStack || card.tags.slice(0, 4).join(" · ") },
  ].filter((row) => row.value.trim().length > 0)

  const contextBlock = contextRows.length > 0 && (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 8 }}
      transition={{ delay: isVisible ? 0.32 : 0, duration: 0.28, ease: EASE_OUT }}
      style={{ marginBottom: "1.05rem" }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 25,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(224, 182, 255, 0.88)",
          marginBottom: "0.55rem",
        }}
      >
        Context
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.45rem",
        }}
      >
        {contextRows.map((row, i) => (
          <motion.li
            key={row.label}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -6 }}
            transition={{ delay: isVisible ? 0.34 + i * 0.05 : 0, duration: 0.24, ease: EASE_OUT }}
            style={{
              display: "flex",
              gap: "0.5rem",
              fontSize: "0.865rem",
              lineHeight: 1.65,
              color: IND.textBody,
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 12,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "rgba(224, 182, 255, 0.74)",
                minWidth: 66,
                flexShrink: 0,
                marginTop: "0.1rem",
              }}
            >
              {row.label}
            </span>
            <span>{row.value}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )

  const highlightsBlock = card.highlights.length > 0 && (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 8 }}
      transition={{ delay: isVisible ? 0.4 : 0, duration: 0.3, ease: EASE_OUT }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 25,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(224, 182, 255, 0.88)",
          marginBottom: "0.55rem",
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
          gap: "0.625rem",
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
              lineHeight: 1.82,
              color: IND.textBody,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                marginTop: "0.62rem",
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


  // ── Portrait panel layout: images on left, text on right ─────────────────
  // Triggered when all work examples resolve as portrait orientation.
  if (allWorkPortrait) {
    return (
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left: portrait images stacked, scrollable */}
        <div
          className="card-scroll"
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
            <div key={i} style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div
                style={{
                  width: "100%",
                  aspectRatio: PORTRAIT_IMG_RATIO,
                  overflow: "hidden",
                  borderRadius: 8,
                  background: "#000",
                }}
              >
                <img
                  src={src}
                  alt={card.workExampleCaptions?.[i] ?? `${card.title} example ${i + 1}`}
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
              {card.workExampleCaptions?.[i] && (
                <p
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 15,
                    letterSpacing: "0.03em",
                    color: "rgba(200, 178, 245, 0.82)",
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {card.workExampleCaptions[i]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Right: all text content, scrollable */}
        <div className="card-scroll" style={{ flex: 1, overflowY: "auto", padding: pad }}>
          {contextBlock}
          {highlightsBlock}
          {descBlock}
        </div>
      </div>
    )
  }

  // ── Default stacked layout ────────────────────────────────────────────────
  return (
    <div className="card-scroll" style={{ flex: 1, overflowY: "auto", padding: pad }}>
      {contextBlock}
      {highlightsBlock}

      {/* Work examples inline (SWEMaxx uses side WorkExamplesPanel instead) */}
      {workImages.length > 0 && !workExamplesInSidePanel && (
        <WorkExamplesSection
          images={workImages}
          overrideTypes={card.workExampleTypes}
          captions={card.workExampleCaptions}
          accent={accent}
          isVisible={isVisible}
          mode="inline"
        />
      )}

      {descBlock}
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
  const heroFocalPos = card.thumbnailObjectPosition

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
            <div
              style={
                heroFocalPos
                  ? { position: "relative", height: 220, overflow: "hidden" }
                  : { position: "relative", maxHeight: 220, overflow: "hidden" }
              }
            >
              <img
                src={card.image}
                alt={card.title}
                draggable={false}
                loading="lazy"
                style={
                  heroFocalPos
                    ? {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: heroFocalPos,
                        display: "block",
                      }
                    : {
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }
                }
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

      <ExpandedBody
        card={card}
        isVisible={isVisible}
        accent={accent}
      />
    </div>
  )
}

// ─── Demo Side Panel ─────────────────────────────────────────────────────────
// Appears to the right of the expanded card when the active card has youtubeIds.

function DemoPanel({
  card,
  isVisible,
}: {
  card: ApertureCard
  isVisible: boolean
}) {
  const accent = card.type === "experience" ? IND.accentExp : IND.accentProj
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)

  return (
    <div
      className="card-scroll"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1.1rem 1rem",
        overflowY: "auto",
        background: IND.surfaceExpanded,
        borderRadius: 16,
        border: "1px solid rgba(224, 182, 255, 0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 28,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(224, 182, 255, 0.88)",
          marginBottom: "0.75rem",
          flexShrink: 0,
        }}
      >
        Demo
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        {card.youtubeIds!.map((id, idx) => (
          <motion.div
            key={id}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 12 }}
            transition={{ delay: isVisible ? 0.3 + idx * 0.08 : 0, duration: 0.3, ease: EASE_OUT }}
            style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}
          >
            {/* Caption / note above the video */}
            {card.youtubeNote && (
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 33,
                  letterSpacing: "0.02em",
                  color: "rgba(200, 178, 245, 0.85)",
                  margin: 0,
                  lineHeight: 1.35,
                }}
              >
                {card.youtubeNote}
              </p>
            )}
            <MonitorFrame style={{ aspectRatio: "4 / 3", height: "auto" }}>
              {playingIdx === idx ? (
                <iframe
                  src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  title={`Demo ${idx + 1}`}
                />
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                    alt={`Demo ${idx + 1}`}
                    draggable={false}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); setPlayingIdx(idx) }}
                    aria-label="Play video"
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,0.28)",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 5,
                    }}
                  >
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        borderTop: "1px solid rgba(255,255,255,0.32)",
                        borderRight: "1px solid rgba(255,255,255,0.12)",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        borderLeft: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(224,182,255,0.14)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        color: "#fff",
                        fontFamily: FONT_MONO,
                        transition: "background 0.15s ease",
                      }}
                    >
                      ▶
                    </div>
                  </button>
                </>
              )}
            </MonitorFrame>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Work examples side panel (SWEMaxx) ─────────────────────────────────────
// Same geometry as DemoPanel: wide readable screenshots with object-fit contain.

function WorkExamplesSidePanel({
  card,
  isVisible,
}: {
  card: ApertureCard
  isVisible: boolean
}) {
  const images = card.images ?? []
  return (
    <div
      className="card-scroll"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1.1rem 1rem",
        overflowY: "auto",
        background: IND.surfaceExpanded,
        borderRadius: 16,
        border: "1px solid rgba(224, 182, 255, 0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <p
        style={{
          fontFamily: FONT_MONO,
          fontSize: 28,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(224, 182, 255, 0.88)",
          marginBottom: "0.75rem",
          flexShrink: 0,
        }}
      >
        Work examples
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        {images.map((src, idx) => (
          <motion.div
            key={src}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 12 }}
            transition={{ delay: isVisible ? 0.25 + idx * 0.08 : 0, duration: 0.3, ease: EASE_OUT }}
            style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}
          >
            {card.workExampleCaptions?.[idx] && (
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 13,
                  letterSpacing: "0.03em",
                  lineHeight: 1.45,
                  color: "rgba(200, 178, 245, 0.82)",
                  margin: 0,
                }}
              >
                {card.workExampleCaptions[idx]}
              </p>
            )}
            <MonitorFrame style={{ width: "100%", height: "auto", minHeight: 140 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10",
                  minHeight: 140,
                  background: "#07060a",
                  overflow: "hidden",
                }}
              >
                <img
                  src={src}
                  alt={card.workExampleCaptions?.[idx] ?? `${card.title} example ${idx + 1}`}
                  draggable={false}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>
            </MonitorFrame>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CardGrid({ dealSeed }: CardGridProps) {
  const {
    setLeftFocusedIndex,
    setCardExpanded,
    jumpToHero,
    jumpToFooter,
    contactModalOpen,
  } = useScrollOrchestrator()
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

  const { filter, setFilter, baseCards } = useApertureFilter()
  const [renderCards, setRenderCards] = useState<ApertureCard[]>(baseCards)
  const [exitingIds, setExitingIds] = useState<string[]>([])
  const filterTimeoutRef = useRef<number | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (filterTimeoutRef.current != null) window.clearTimeout(filterTimeoutRef.current)
      if (closeTimeoutRef.current != null) window.clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  const { cardStates, activeId, isExpanded, activateCard, closeActive } =
    usePuzzleEngine(renderCards, containerRef)

  function selectByFilter(nextFilter: ApertureFilter): ApertureCard[] {
    if (nextFilter === "all") return baseCards.map((c) => ({ ...c, ghosted: false }))
    return baseCards
      .filter((c) => c.type === nextFilter)
      .map((c) => ({ ...c, ghosted: false }))
  }

  function handleFilterChange(nextFilter: ApertureFilter) {
    if (nextFilter === filter) return
    if (filterTimeoutRef.current != null) window.clearTimeout(filterTimeoutRef.current)
    if (closeTimeoutRef.current != null) window.clearTimeout(closeTimeoutRef.current)

    const runTransition = () => {
      setFilter(nextFilter)
      const nextCards = selectByFilter(nextFilter)
      if (nextFilter === "all") {
        setExitingIds([])
        setRenderCards(nextCards)
        return
      }
      const leaving = renderCards
        .filter((c) => c.type !== nextFilter)
        .map((c) => c.id)

      if (leaving.length === 0) {
        setRenderCards(nextCards)
        return
      }
      setExitingIds(leaving)
      filterTimeoutRef.current = window.setTimeout(() => {
        setRenderCards(nextCards)
        setExitingIds([])
      }, FILTER_EXIT_MS)
    }

    if (isExpanded) {
      closeActive()
      closeTimeoutRef.current = window.setTimeout(runTransition, FILTER_CLOSE_MS)
      return
    }
    runTransition()
  }

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
    document.body.style.overflow = isExpanded ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isExpanded])

  useEffect(() => {
    setLeftFocusedIndex(0)
  }, [setLeftFocusedIndex])

  // Wheel gestures in screen edge bands:
  // - Top band + wheel up at page top -> return to intro hero
  // - Bottom band + wheel down -> open contact modal
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (isExpanded) return
      if (isTypingTarget(e.target)) return
      if (contactModalOpen) return

      const topBand = window.innerHeight * TOP_PAD_RATIO
      const bottomBand = window.innerHeight * (1 - TOP_PAD_RATIO)

      if (e.deltaY < -22) {
        if (window.scrollY > 12) return
        if (e.clientY > topBand) return
        jumpToHero()
        return
      }

      if (e.deltaY > 22) {
        if (e.clientY < bottomBand) return
        jumpToFooter()
      }
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => window.removeEventListener("wheel", onWheel)
  }, [isExpanded, jumpToHero, jumpToFooter, contactModalOpen])

  const { w: cW, h: cH } = containerSize
  const activeCard = renderCards.find(c => c.id === activeId)
  const hasDemo =
    isExpanded && (activeCard?.youtubeIds?.length ?? 0) > 0
  const hasWorkExamplesSidePanel =
    isExpanded &&
    activeCard?.id === "proj-swemaxx" &&
    (activeCard?.images?.length ?? 0) > 0
  const hasSidePanel = hasDemo || hasWorkExamplesSidePanel

  // Side panel layout: main card ~60% left, panel ~33% right (demo video or SWEMaxx screenshots)
  const expandedW = hasSidePanel ? Math.round(cW * 0.60) : Math.round(cW * 0.75)
  const expandedH = Math.round(cH * 0.90) - 10
  const expandedX = hasSidePanel ? Math.round(cW * 0.03) : Math.round((cW - expandedW) / 2)
  const expandedY = Math.round((cH - expandedH) / 2) + 10

  const sidePanelW = Math.round(cW * 0.33)
  const sidePanelX = expandedX + expandedW + Math.round(cW * 0.015)
  const sidePanelY = expandedY

  return (
    <div
      id="deck-cards"
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
          background:
            "radial-gradient(ellipse 130% 85% at 50% 0%, rgba(21, 19, 20, 0) 0%, rgba(21, 19, 20, 0.22) 62%, rgba(21, 19, 20, 0.60) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "20vh",
          pointerEvents: "none",
          zIndex: 15,
          background: "linear-gradient(to top, rgba(21, 19, 20, 0), #151314)",
        }}
      />
      <CloudBank side="top" />
      <CloudBank side="bottom" />

      {/* Intro + filter — one row, shared baseline (center-aligned vertically) */}
      <div
        style={{
          position: "absolute",
          top: "max(12px, 5vh)",
          left: 0,
          right: 0,
          zIndex: 55,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 40,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "max(1rem, 5vw)",
            pointerEvents:
              contactModalOpen || isExpanded ? "none" : "auto",
            display: contactModalOpen ? "none" : "block",
            opacity: isExpanded ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          <motion.button
            type="button"
            onClick={jumpToHero}
            aria-label="Return to intro hero"
            className={jumpNavPillClassName}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_DECK }}
            style={{ pointerEvents: "auto" }}
          >
            <motion.span
              animate={{ y: [-1, 1, -1] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
              className="text-[0.85rem] leading-none"
              style={{ color: "#e0b6ff" }}
            >
              ↑
            </motion.span>
            <span>Intro</span>
          </motion.button>
        </div>
        <div
          style={{
            pointerEvents: activeId ? "none" : "auto",
            opacity: activeId ? 0 : 1,
            transition: "opacity 0.25s ease",
          }}
        >
          <FilterBar active={filter} onChange={handleFilterChange} />
        </div>
      </div>

      {/* ── Puzzle Cards ──────────────────────────────────────────────────── */}
      {renderCards.map((card, idx) => {
        const state = cardStates[card.id] as PuzzleCardState | undefined
        if (!state) return null

        const isActive     = card.id === activeId
        const showExpanded = isActive && isExpanded
        const isExiting = exitingIds.includes(card.id) && !showExpanded

        const targetX = showExpanded ? expandedX : state.x
        const targetY = showExpanded ? expandedY : state.y
        const targetW = showExpanded ? expandedW : state.width
        const targetH = showExpanded ? expandedH : state.height

        const xyTransition = getTransition(state.phase)
        const dealDelay    = idx * 0.055

        return (
          <Fragment key={card.id}>
            <motion.article
              className="aperture-card-shell"
              data-expanded={showExpanded ? "true" : "false"}
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
                opacity:    isExiting ? 0 : state.opacity,
                scale:      isExiting ? 0.97 : 1,
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
                  : { duration: isExiting ? FILTER_EXIT_MS / 1000 : 0.32 },
              }}
              style={{
                position:             state.phase === "gutter" ? "fixed" : "absolute",
                left:                 0,
                top:                  0,
                minHeight:            CARD_HEIGHT,
                borderRadius:         16,
                cursor:               isActive ? "default" : "pointer",
                overflow:             "hidden",
                zIndex:               state.zIndex,
                filter:               state.filter,
                pointerEvents:        state.phase === "gutter" || isExiting ? "none" : "auto",
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
                  filter:
                    "drop-shadow(0 10px 5px rgba(250, 242, 242, 0.25)) drop-shadow(0 2px 1px rgba(0, 0, 0, 0.25))",
                }}
              />
            )}
          </Fragment>
        )
      })}

      {/* ── Demo side panel — YouTube embeds ── */}
      {hasDemo && activeCard && (
        <motion.div
          key="demo-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          style={{
            position:             "absolute",
            left:                 sidePanelX,
            top:                  sidePanelY,
            width:                sidePanelW,
            height:               expandedH,
            borderRadius:         16,
            overflow:             "hidden",
            zIndex:               50,
            pointerEvents:        "auto",
          }}
        >
          <DemoPanel card={activeCard} isVisible={isExpanded} />
        </motion.div>
      )}

      {/* ── Work examples side panel — SWEMaxx full screenshots ── */}
      {hasWorkExamplesSidePanel && activeCard && (
        <motion.div
          key="work-examples-panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          style={{
            position:             "absolute",
            left:                 sidePanelX,
            top:                  sidePanelY,
            width:                sidePanelW,
            height:               expandedH,
            borderRadius:         16,
            overflow:             "hidden",
            zIndex:               50,
            pointerEvents:        "auto",
          }}
        >
          <WorkExamplesSidePanel card={activeCard} isVisible={isExpanded} />
        </motion.div>
      )}

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
