"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import type { Project } from "@/lib/data"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row h-full">
        <Link
          href={`/projects/${project.id}`}
          className="relative w-full md:w-[420px] h-[280px] md:h-[320px] flex-shrink-0 bg-gray-100"
        >
          <Image
            src={project.image || "/placeholder.png"}
            alt={project.title}
            className="object-cover hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="flex-1 p-8 flex flex-col">
          <Link 
            href={`/projects/${project.id}`} 
            className="block flex-grow group/link"
          >
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 group-hover/link:text-purple-700 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-600 mb-6">{project.description}</p>
          </Link>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-2">
              {project.categories.map((category) => (
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
  )
}
