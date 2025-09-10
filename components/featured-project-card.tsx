"use client"

import React from 'react';
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import type { Project } from "@/lib/data"
import { Button } from './ui/button';

interface FeaturedProjectCardProps {
  project: Project
}

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    // Parse YYYY-MM-DD as a LOCAL date to avoid UTC offset shifting months
    const [yearStr, monthStr, dayStr] = dateString.split("-")
    const year = Number(yearStr)
    const monthIndex = Number(monthStr) - 1 // 0-based month
    const day = Number(dayStr)
    const date = new Date(year, monthIndex, day)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
        <div className="flex flex-col md:flex-row h-full">
          <div className="relative w-full md:w-[420px] h-[280px] md:h-[320px] flex-shrink-0 bg-gray-100">
            <Image
              src={project.image || "/placeholder.png"}
              alt={project.title}
              className="object-cover hover:scale-105 transition-transform duration-300"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="flex-1 p-8 flex flex-col">
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                  {project.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {(() => {
                    const start = formatDate(project.startDate)
                    const end = project.endDate ? formatDate(project.endDate) : ""

                    // If no end date: default to showing only start date
                    if (!project.endDate) {
                      // Special-case: show "Present" only for Torrentia (in-progress timeline)
                      if (project.id === "torrentia") {
                        return `${start} - Present`
                      }
                      return start
                    }

                    // If start and end are the same month-year, show only one
                    if (end === start) {
                      return start
                    }

                    return `${start} - ${end}`
                  })()}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{project.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-wrap gap-2">
                {project.categories && project.categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-white bg-purple-600 hover:bg-purple-700 transition-colors font-medium rounded-md px-3 py-1 text-sm"
                  >
                    <span>Live Demo</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium rounded-md px-3 py-1 text-sm"
                  >
                    <Github className="h-4 w-4" />
                    <span>View Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
