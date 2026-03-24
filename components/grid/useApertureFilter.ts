"use client"

import { useMemo, useState } from "react"
import { experiences } from "@/lib/experience"
import { projects } from "@/lib/data"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApertureFilter = "all" | "experience" | "project"

export interface ApertureCard {
  id: string
  type: "experience" | "project"
  startDate: string
  title: string
  meta: string
  description: string
  tags: string[]
  /**
   * Key metrics / bullets to surface first in the expanded view.
   * Experience → achievements[]; Project → takeaways[].
   */
  highlights: string[]
  /** True when a filter is active and this card doesn't match. */
  ghosted: boolean
  /** Primary thumbnail / hero image */
  image?: string
  /** Secondary work-example images (up to 2) */
  images?: string[]
  githubUrl?: string
  liveUrl?: string
  /** YouTube video ID — if set, a thumbnail preview appears in expanded view */
  youtubeId?: string
  /** Drives layout branching: portrait stacks image to the side, landscape stacks it on top */
  imageType?: "portrait" | "landscape"
  /** Optional per-image orientation override for work examples */
  workExampleTypes?: ("portrait" | "landscape")[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMs(dateStr: string): number {
  return new Date(dateStr).getTime()
}

/**
 * Priority Sort — builds a chronologically interleaved pool from the two
 * data sources. Both sequences are independently sorted newest-first before
 * the merge, so the grid always reads as a coherent timeline.
 *
 * Merge strategy: greedy pick of whichever next item is more recent.
 * Ties go to experience so that role history stays legible.
 */
function buildChronologicalPool(): ApertureCard[] {
  const expCards: ApertureCard[] = experiences
    .slice()
    .sort((a, b) => toMs(b.startDate) - toMs(a.startDate))
    .map((e) => ({
      id: `exp-${e.id}`,
      type: "experience" as const,
      startDate: e.startDate,
      title: e.company,
      meta: e.title,
      description: e.description,
      tags: e.tools,
      highlights: e.achievements,
      ghosted: false,
      image:            e.image,
      images:           e.workExamples,
      workExampleTypes: e.workExampleTypes,
      githubUrl:        e.githubUrl,
      liveUrl:          e.liveUrl,
      youtubeId:        e.showYoutube ? e.youtubeId : undefined,
    }))

  const projCards: ApertureCard[] = projects
    .slice()
    .sort((a, b) => toMs(b.startDate) - toMs(a.startDate))
    .map((p) => ({
      id: `proj-${p.id}`,
      type: "project" as const,
      startDate: p.startDate,
      title: p.title,
      meta: p.categories.slice(0, 2).join(" · "),
      description: p.description,
      tags: p.tools,
      highlights: p.takeaways,
      ghosted: false,
      image:     p.image,
      githubUrl: p.githubUrl,
      liveUrl:   p.liveUrl,
      imageType: p.imageType,
    }))

  // Chronological merge: two-pointer greedy, newest-first
  const merged: ApertureCard[] = []
  let ei = 0
  let pi = 0
  while (ei < expCards.length || pi < projCards.length) {
    const exp  = expCards[ei]
    const proj = projCards[pi]
    if (!exp)  { merged.push(projCards[pi++]); continue }
    if (!proj) { merged.push(expCards[ei++]);  continue }
    // Ties go to experience
    if (toMs(exp.startDate) >= toMs(proj.startDate)) {
      merged.push(expCards[ei++])
    } else {
      merged.push(projCards[pi++])
    }
  }
  return merged
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Active Filtering + Priority Sort — the aperture's "logical reordering" layer.
 *
 * - "all"        → chronological merge, nothing ghosted.
 * - "experience" → matching cards fill Row 1, Row 2 … in chronological order;
 *                  non-matching cards are demoted to the end with ghosted=true.
 * - "project"    → same, but for projects.
 *
 * Framer Motion's `layout` prop on each grid item handles the seamless
 * position swap animation when `filter` changes.
 */
export function useApertureFilter() {
  const [filter, setFilter] = useState<ApertureFilter>("all")
  const basePool = useMemo(() => buildChronologicalPool(), [])

  const orderedCards = useMemo((): ApertureCard[] => {
    if (filter === "all") {
      return basePool.map((c) => ({ ...c, ghosted: false }))
    }

    // Matching cards keep their relative chronological order (basePool is
    // already sorted so .filter() preserves that invariant).
    const matching = basePool
      .filter((c) => c.type === filter)
      .map((c) => ({ ...c, ghosted: false }))

    const ghosted = basePool
      .filter((c) => c.type !== filter)
      .map((c) => ({ ...c, ghosted: true }))

    return [...matching, ...ghosted]
  }, [basePool, filter])

  return { filter, setFilter, orderedCards }
}
