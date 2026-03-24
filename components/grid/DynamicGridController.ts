"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

export interface DynamicGridCard {
  id: string
}

interface CloudMaskThresholds {
  top: number
  bottom: number
}

interface GridCardFx {
  opacity: number
}

export interface DynamicGridControllerState {
  order: string[]
  expandedId: string | null
  visibleIds: string[]
  cardFx: Record<string, GridCardFx>
  /** Exposed so callers can pass the map to useRadialDisplacement. */
  cardMapRef: React.MutableRefObject<Map<string, HTMLElement>>
  registerCardRef: (id: string, el: HTMLElement | null) => void
  onCardSelect: (id: string) => void
  closeExpanded: () => void
}

const TOP_CLOUD_PORTION = 0.2
const BOTTOM_CLOUD_PORTION = 0.2

export function useDynamicGridController(
  cards: DynamicGridCard[],
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
): DynamicGridControllerState {
  const [order, setOrder] = useState<string[]>(() => cards.map((c) => c.id))
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [visibleIds, setVisibleIds] = useState<string[]>([])
  const [cardFx, setCardFx] = useState<Record<string, GridCardFx>>({})

  const cardMapRef = useRef(new Map<string, HTMLElement>())
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setOrder(cards.map((c) => c.id))
  }, [cards])

  const getThresholds = useCallback((container: HTMLDivElement): CloudMaskThresholds => {
    const top = container.clientHeight * TOP_CLOUD_PORTION
    const bottom = container.clientHeight * (1 - BOTTOM_CLOUD_PORTION)
    return { top, bottom }
  }, [])

  const recomputeCardFx = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const thresholds = getThresholds(container)
    const nextVisible: string[] = []
    const nextFx: Record<string, GridCardFx> = {}

    cardMapRef.current.forEach((el, id) => {
      const r = el.getBoundingClientRect()
      const centerY = r.top - containerRect.top + r.height / 2

      const intersectsViewport = r.bottom > containerRect.top && r.top < containerRect.bottom
      if (intersectsViewport) nextVisible.push(id)

      // Cards entering top cloud drop to 40% opacity.
      if (centerY < thresholds.top) {
        const distance = Math.max(0, thresholds.top - centerY)
        const t = Math.min(1, distance / Math.max(1, thresholds.top))
        nextFx[id] = { opacity: 1 - 0.6 * t }
        return
      }

      // Emerging from bottom cloud: fade in from 40% to 100%.
      if (centerY > thresholds.bottom) {
        const distance = Math.max(0, centerY - thresholds.bottom)
        const zone = Math.max(1, container.clientHeight - thresholds.bottom)
        const t = Math.min(1, distance / zone)
        nextFx[id] = { opacity: 1 - 0.6 * t }
        return
      }

      nextFx[id] = { opacity: 1 }
    })

    setVisibleIds(nextVisible)
    setCardFx(nextFx)
  }, [getThresholds, scrollContainerRef])

  const scheduleRecompute = useCallback(() => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      recomputeCardFx()
    })
  }, [recomputeCardFx])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    scheduleRecompute()
    container.addEventListener("scroll", scheduleRecompute, { passive: true })
    window.addEventListener("resize", scheduleRecompute, { passive: true })
    return () => {
      container.removeEventListener("scroll", scheduleRecompute)
      window.removeEventListener("resize", scheduleRecompute)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [scheduleRecompute, scrollContainerRef])

  const registerCardRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) {
        cardMapRef.current.set(id, el)
      } else {
        cardMapRef.current.delete(id)
      }
      scheduleRecompute()
    },
    [scheduleRecompute],
  )

  // Order is now managed externally by useApertureFilter; onCardSelect only
  // tracks the expanded id. Radial displacement is handled by useRadialDisplacement.
  const onCardSelect = useCallback((id: string) => {
    setExpandedId(id)
  }, [])

  const closeExpanded = useCallback(() => setExpandedId(null), [])

  return {
    order,
    expandedId,
    visibleIds,
    cardFx,
    cardMapRef,
    registerCardRef,
    onCardSelect,
    closeExpanded,
  }
}
