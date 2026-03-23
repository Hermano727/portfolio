"use client"

import { LayoutGroup } from "framer-motion"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { getPhaseFromScroll } from "@/components/scene/SceneManager"
import { experiences } from "@/lib/experience"
import { projects } from "@/lib/data"
import DeckColumn, { type DeckColumnHandle } from "./DeckColumn"
import type { DeckCardModel } from "./DeckCard"

export default function CardDeck() {
  const {
    scrollProgress,
    leftFocusedIndex,
    rightFocusedIndex,
    setLeftFocusedIndex,
    setRightFocusedIndex,
  } = useScrollOrchestrator()

  // ── Active column — which column arrow keys currently target ───────────────
  const [activeColumn, setActiveColumn] = useState<"left" | "right">("left")

  // Stale-closure-safe refs for use inside the keyboard handler.
  const activeColumnRef = useRef<"left" | "right">("left")
  const leftFocusedIndexRef = useRef(leftFocusedIndex)
  const rightFocusedIndexRef = useRef(rightFocusedIndex)

  useEffect(() => { activeColumnRef.current = activeColumn }, [activeColumn])
  useEffect(() => { leftFocusedIndexRef.current = leftFocusedIndex }, [leftFocusedIndex])
  useEffect(() => { rightFocusedIndexRef.current = rightFocusedIndex }, [rightFocusedIndex])

  // ── Imperative handles to the two column instances ─────────────────────────
  const leftColRef = useRef<DeckColumnHandle>(null)
  const rightColRef = useRef<DeckColumnHandle>(null)

  // ── Card data (source of truth — order must match lib/ array order) ────────
  const experience = useMemo<DeckCardModel[]>(
    () =>
      experiences.map((exp) => {
        const experienceImage = exp.workExamples?.find((url) =>
          url.includes("/assets/experience/")
        )
        return {
          id: `exp-${exp.id}`,
          title: exp.company,
          meta: exp.title,
          hook: exp.description,
          bullets: exp.achievements,
          image: experienceImage,
          tags: exp.tools,
        }
      }),
    []
  )

  const projectCards = useMemo<DeckCardModel[]>(
    () =>
      projects.map((p) => ({
        id: `proj-${p.id}`,
        title: p.title,
        meta: p.categories.slice(0, 2).join(" · "),
        hook: p.description,
        bullets: p.takeaways,
        image: p.image,
        tags: p.tools,
        liveUrl: p.liveUrl,
        variant: p.id === "echoes-of-pharloom" ? "pharloom" : undefined,
      })),
    []
  )

  // Stable card-count refs — used inside the keyboard handler.
  const expCountRef = useRef(experience.length)
  const projCountRef = useRef(projectCards.length)
  useEffect(() => { expCountRef.current = experience.length }, [experience.length])
  useEffect(() => { projCountRef.current = projectCards.length }, [projectCards.length])

  // ── Derive current scene phase from scroll progress ────────────────────────
  const phase = getPhaseFromScroll(scrollProgress)

  // ── Global keyboard controller ─────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Never intercept keys when the user is typing in a form field.
    const tag = (e.target as HTMLElement)?.tagName
    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (e.target as HTMLElement)?.isContentEditable
    ) {
      return
    }

    const col = activeColumnRef.current
    const colRef = col === "left" ? leftColRef : rightColRef
    const focusedIdx =
      col === "left" ? leftFocusedIndexRef.current : rightFocusedIndexRef.current
    const cardCount = col === "left" ? expCountRef.current : projCountRef.current

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        setActiveColumn("left")
        break

      case "ArrowRight":
        e.preventDefault()
        setActiveColumn("right")
        break

      case "ArrowUp":
        e.preventDefault()
        colRef.current?.scrollToCard(Math.max(0, focusedIdx - 1))
        break

      case "ArrowDown":
        e.preventDefault()
        colRef.current?.scrollToCard(Math.min(cardCount - 1, focusedIdx + 1))
        break

      case "Enter":
      case " ":
        // Space: only intercept when a column card is the logical target,
        // so the contact form submit button still works.
        if (tag === "BUTTON" || tag === "A") break
        e.preventDefault()
        colRef.current?.expandCardAtIndex(focusedIdx)
        break

      case "Escape":
        // collapseExpanded is also called by DeckColumn's own Escape handler
        // (scoped to isActive), so this is redundant-but-harmless.
        colRef.current?.collapseExpanded()
        break
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return (
    // Full-bleed layout: columns span the entire viewport, no outer padding/max-width.
    <div className="relative w-full" style={{ height: "100vh" }}>
      <LayoutGroup>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            height:              "100%",
          }}
        >
          <DeckColumn
            ref={leftColRef}
            title="Experience"
            cards={experience}
            onFocusedIndexChange={setLeftFocusedIndex}
            isActive={activeColumn === "left"}
            phase={phase}
            onPointerInteraction={() => setActiveColumn("left")}
          />

          {/* Thin vertical divider between columns */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top:       "8%",
              bottom:    "8%",
              left:      "50%",
              width:     "1px",
              background: "linear-gradient(to bottom, transparent, rgba(74,66,73,0.25) 20%, rgba(74,66,73,0.25) 80%, transparent)",
              transform: "translateX(-50%)",
              pointerEvents: "none",
            }}
          />

          <DeckColumn
            ref={rightColRef}
            title="Projects"
            cards={projectCards}
            onFocusedIndexChange={setRightFocusedIndex}
            isActive={activeColumn === "right"}
            phase={phase}
            onPointerInteraction={() => setActiveColumn("right")}
          />
        </div>
      </LayoutGroup>
    </div>
  )
}
