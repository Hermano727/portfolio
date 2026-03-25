"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { getPhaseFromScroll } from "@/components/scene/SceneManager"
import { experiences } from "@/lib/experience"
import { projects } from "@/lib/data"
import DeckColumn, { type DeckColumnHandle } from "./DeckColumn"
import type { DeckCardModel } from "./DeckCard"
import { useDeckState } from "./DeckStateController"
import { EASE_OUT } from "@/lib/motion"
import { isTypingTarget } from "@/lib/dom"

// Slide variants — custom value is the direction integer (+1 or -1).
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir * 64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: -dir * 64, opacity: 0 }),
}

// ── Switcher button ────────────────────────────────────────────────────────────

interface SwitcherBtnProps {
  label: string
  side: "left" | "right"
  disabled: boolean
  onClick: () => void
}

function SwitcherBtn({ label, side, disabled, onClick }: SwitcherBtnProps) {
  const isLeft = side === "left"
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`Switch to ${label}`}
      style={{
        background:    "transparent",
        border:        "none",
        cursor:        disabled ? "default" : "pointer",
        padding:       "0.35rem 0.7rem",
        borderRadius:  "0.375rem",
        color:         disabled ? "rgba(208,194,213,0.22)" : "rgba(208,194,213,0.62)",
        display:       "flex",
        alignItems:    "center",
        gap:           "0.4rem",
        transition:    "color 0.2s ease",
        outline:       "none",
        flexShrink:    0,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.color = "rgba(224,182,255,0.85)"
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.color = "rgba(208,194,213,0.62)"
      }}
    >
      {isLeft && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span
        style={{
          fontFamily:    "var(--font-space-grotesk), var(--font-geist-sans), sans-serif",
          fontWeight:    600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontSize:      "0.56rem",
        }}
      >
        {label}
      </span>
      {!isLeft && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function CardDeck() {
  const {
    sceneScrollProgress,
    leftFocusedIndex,
    setLeftFocusedIndex,
  } = useScrollOrchestrator()

  const { mode, direction, switchTo } = useDeckState()

  const colRef          = useRef<DeckColumnHandle>(null)
  const focusedIndexRef = useRef(leftFocusedIndex)
  useEffect(() => { focusedIndexRef.current = leftFocusedIndex }, [leftFocusedIndex])

  // ── Card data ──────────────────────────────────────────────────────────────
  const experience = useMemo<DeckCardModel[]>(
    () =>
      experiences.map((exp) => {
        const experienceImage = exp.workExamples?.find((url) =>
          url.includes("/assets/experience/")
        )
        return {
          id:      `exp-${exp.id}`,
          title:   exp.company,
          meta:    exp.title,
          hook:    exp.description,
          bullets: exp.achievements,
          image:   experienceImage ?? exp.image,
          tags:    exp.tools,
        }
      }),
    []
  )

  const projectCards = useMemo<DeckCardModel[]>(
    () =>
      projects.map((p) => ({
        id:      `proj-${p.id}`,
        title:   p.title,
        meta:    p.gridMeta ?? p.categories.slice(0, 2).join(" · "),
        hook:    p.description,
        bullets: p.takeaways,
        image:   p.image,
        tags:    p.tools,
        liveUrl: p.liveUrl,
        variant: p.id === "echoes-of-pharloom" ? "featured" : undefined,
      })),
    []
  )

  const activeCards    = mode === "experience" ? experience : projectCards
  const cardCountRef   = useRef(activeCards.length)
  useEffect(() => { cardCountRef.current = activeCards.length }, [activeCards.length])

  const phase = getPhaseFromScroll(sceneScrollProgress)

  // ── Keyboard controller (Up/Down card nav, Enter/Space expand, Esc collapse) ─
  // A/D and ArrowLeft/Right are owned by useDeckState.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTypingTarget(e.target)) return

    switch (e.key) {
      case "ArrowUp":
        e.preventDefault()
        colRef.current?.scrollToCard(Math.max(0, focusedIndexRef.current - 1))
        break

      case "ArrowDown":
        e.preventDefault()
        colRef.current?.scrollToCard(Math.min(cardCountRef.current - 1, focusedIndexRef.current + 1))
        break

      case "Enter":
      case " ":
        {
          const t = e.target
          if (t instanceof Element && (t.tagName === "BUTTON" || t.tagName === "A")) break
        }
        e.preventDefault()
        colRef.current?.expandCardAtIndex(focusedIndexRef.current)
        break

      case "Escape":
        colRef.current?.collapseExpanded()
        break
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const isExperience = mode === "experience"

  return (
    <div
      className="relative w-full"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >

      {/* ── Deck Switcher ────────────────────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          justifyContent: "center",
          alignItems:     "center",
          gap:            "1rem",
          paddingTop:     "2rem",
          paddingBottom:  "0.25rem",
          flexShrink:     0,
          zIndex:         20,
          position:       "relative",
        }}
      >
        <SwitcherBtn
          label="Experience"
          side="left"
          disabled={isExperience}
          onClick={() => switchTo("experience")}
        />

        {/* Active mode label — fades between states */}
        <AnimatePresence mode="wait">
          <motion.span
            key={mode}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.18 }}
            style={{
              fontFamily:    "var(--font-space-grotesk), var(--font-geist-sans), sans-serif",
              fontWeight:    600,
              fontSize:      "0.56rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color:         "rgba(244,237,248,0.75)",
              minWidth:      "6rem",
              textAlign:     "center",
              pointerEvents: "none",
            }}
          >
            {mode}
          </motion.span>
        </AnimatePresence>

        <SwitcherBtn
          label="Projects"
          side="right"
          disabled={!isExperience}
          onClick={() => switchTo("projects")}
        />
      </div>

      {/* Keyboard hint */}
      <div
        aria-hidden="true"
        style={{
          textAlign:     "center",
          fontSize:      "0.52rem",
          letterSpacing: "0.16em",
          color:         "rgba(208,194,213,0.25)",
          fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
          paddingBottom: "0.15rem",
          flexShrink:    0,
        }}
      >
        [A] ← → [D]
      </div>

      {/* ── Single Ladder Column ─────────────────────────────────────────────── */}
      <div style={{ flex: "1 1 0", minHeight: 0, position: "relative", overflow: "hidden" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={mode}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.42, ease: EASE_OUT }}
            style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              justifyContent: "center",
            }}
          >
            {/* max-width centering wrapper — cards get a comfortable reading lane */}
            <div style={{ width: "100%", maxWidth: "680px", height: "100%" }}>
              <DeckColumn
                ref={colRef}
                title={mode === "experience" ? "Experience" : "Projects"}
                cards={activeCards}
                onFocusedIndexChange={setLeftFocusedIndex}
                isActive
                phase={phase}
                showHeader={false}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}
