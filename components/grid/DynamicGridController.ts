"use client"

import React, { useCallback, useRef } from "react"

// DynamicGridController — simplified after the Mechanical Sliding Puzzle refactor.
//
// The scroll-based cloud-opacity logic has been removed; card positions and
// opacity are now owned entirely by usePuzzleEngine (CollisionEngine.ts).
//
// This module is kept for future consumers that need a lightweight DOM-ref
// registry (e.g. QuickNav position probing, SceneManager hit-testing).

export interface DynamicGridCard {
  id: string
}

export interface CardRefRegistry {
  cardMapRef: React.MutableRefObject<Map<string, HTMLElement>>
  registerCardRef: (id: string, el: HTMLElement | null) => void
}

export function useCardRefRegistry(): CardRefRegistry {
  const cardMapRef = useRef(new Map<string, HTMLElement>())

  const registerCardRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      cardMapRef.current.set(id, el)
    } else {
      cardMapRef.current.delete(id)
    }
  }, [])

  return { cardMapRef, registerCardRef }
}
