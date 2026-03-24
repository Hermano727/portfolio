"use client"

import { useCallback, useEffect, useState } from "react"
import { isTypingTarget } from "@/lib/dom"

export type DeckMode = "experience" | "projects"

export interface DeckState {
  mode: DeckMode
  /** +1 = rightward (→ projects), -1 = leftward (← experience) */
  direction: number
  switchTo: (next: DeckMode) => void
}

/**
 * Owns the Experience ↔ Projects toggle for the single-ladder CardDeck.
 *
 * Keyboard bindings (ignored when focus is inside a form element):
 *   A  / ArrowLeft  → Experience
 *   D  / ArrowRight → Projects
 */
export function useDeckState(): DeckState {
  const [state, setState] = useState<{ mode: DeckMode; direction: number }>({
    mode: "experience",
    direction: 1,
  })

  const switchTo = useCallback((next: DeckMode) => {
    setState((prev) => {
      if (prev.mode === next) return prev
      return { mode: next, direction: next === "projects" ? 1 : -1 }
    })
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault()
        switchTo("experience")
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault()
        switchTo("projects")
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [switchTo])

  return { mode: state.mode, direction: state.direction, switchTo }
}
