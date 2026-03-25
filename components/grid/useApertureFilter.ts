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
  /** Secondary work-example images */
  images?: string[]
  /** Optional captions per work example image */
  workExampleCaptions?: string[]
  githubUrl?: string
  liveUrl?: string
  /** YouTube video IDs — thumbnails appear in expanded view */
  youtubeIds?: string[]
  /** Note shown under the demo thumbnails (e.g. version disclaimers) */
  youtubeNote?: string
  /** Drives layout branching: portrait stacks image to the side, landscape stacks it on top */
  imageType?: "portrait" | "landscape"
  /** Optional per-image orientation override for work examples */
  workExampleTypes?: ("portrait" | "landscape")[]
  /** CSS object-position for grid thumbnail / landscape hero focal point */
  thumbnailObjectPosition?: string
  /** Human-readable date range for previews + expanded header */
  timeline?: string
  /**
   * Compact grid bullets — from `gridPreviewBullets` in data when set,
   * otherwise first sentence of description plus takeaways/achievements.
   */
  previewBullets: string[]
  /** Expanded context rows shown above highlights. */
  contextProblem: string
  contextWhen: string
  contextWhere: string
  contextStack: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMs(dateStr: string): number {
  return new Date(dateStr).getTime()
}

/** First sentence (or line) of description — card context on the grid. */
function firstSentenceContext(description: string): string {
  const t = description.trim()
  if (!t) return ""
  const line = t.split(/\n/)[0].trim()
  const m = line.match(/^[\s\S]{1,400}?([.!?](?:\s|$)|$)/)
  return (m ? m[0] : line).trim()
}

function normalizeBulletText(s: string | undefined): string {
  if (!s?.trim()) return ""
  return s.trim().replace(/\s+/g, " ")
}

/** Full copy for compact cards: no char/word caps — layout wraps in the panel. */
function buildPreviewBullets(description: string, highlights: string[]): string[] {
  const h = highlights.map(normalizeBulletText).filter(Boolean)
  const b1 = normalizeBulletText(firstSentenceContext(description))
  const out: string[] = []
  if (b1) out.push(b1)
  for (const line of h) {
    if (out.length >= 3) break
    if (line && !out.includes(line)) out.push(line)
  }
  if (out.length === 0 && h[0]) return [h[0]]
  return out.slice(0, 3)
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
      image:               e.image,
      images:              e.workExamples,
      workExampleTypes:    e.workExampleTypes,
      workExampleCaptions: e.workExampleCaptions,
      githubUrl:           e.githubUrl,
      liveUrl:             e.liveUrl,
      youtubeIds: e.showYoutube
        ? (e.youtubeIds ?? (e.youtubeId ? [e.youtubeId] : undefined))
        : undefined,
      youtubeNote: e.youtubeNote,
      timeline: e.timeline,
      contextProblem: e.contextProblem ?? e.description,
      contextWhen: e.contextWhen ?? e.timeline ?? "",
      contextWhere: e.contextWhere ?? e.location,
      contextStack: e.contextStack ?? e.tools.slice(0, 4).join(" · "),
      previewBullets:
        e.gridPreviewBullets?.length
          ? e.gridPreviewBullets.slice(0, 3)
          : buildPreviewBullets(e.description, e.achievements),
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
      image:               p.image,
      images:              p.workExamples,
      workExampleTypes:    p.workExampleTypes,
      workExampleCaptions: p.workExampleCaptions,
      githubUrl:           p.githubUrl,
      liveUrl:             p.liveUrl,
      imageType:           p.imageType,
      thumbnailObjectPosition: p.thumbnailObjectPosition,
      timeline: p.timeline,
      contextProblem: p.contextProblem ?? p.description,
      contextWhen: p.contextWhen ?? p.timeline ?? "",
      contextWhere: p.contextWhere ?? "",
      contextStack: p.contextStack ?? p.tools.slice(0, 4).join(" · "),
      previewBullets:
        p.gridPreviewBullets?.length
          ? p.gridPreviewBullets.slice(0, 3)
          : buildPreviewBullets(p.description, p.takeaways),
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
 * Stores filter intent and the chronological merged card pool.
 * CardGrid handles staged exit/reflow behavior for filter transitions.
 */
export function useApertureFilter() {
  const [filter, setFilter] = useState<ApertureFilter>("all")
  const baseCards = useMemo(() => buildChronologicalPool(), [])
  return { filter, setFilter, baseCards }
}
