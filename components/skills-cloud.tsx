"use client"

import React from "react"
import { projects } from "@/lib/data"

function uniqueSkills(list: string[]): string[] {
  const seen = new Set<string>()
  const order: string[] = []
  for (const item of list) {
    const key = item.trim()
    if (!seen.has(key)) {
      seen.add(key)
      order.push(key)
    }
  }
  return order
}

export default function SkillsCloud() {
  const tools = uniqueSkills(projects.flatMap(p => p.tools))
  const top = tools.slice(0, 18)

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {top.map((t) => (
        <span
          key={t}
          className="select-none rounded-full border border-purple-200 bg-purple-50 text-purple-700 px-3 py-1 text-sm shadow-xs hover:shadow-sm transition-shadow"
        >
          {t}
        </span>
      ))}
    </div>
  )
}
