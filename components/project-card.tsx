"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import type { Project } from "@/lib/data"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    image: string
    githubUrl: string
    categories: string[]
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row h-full">
        <Link
          href={`/projects/${project.id}`}
          className="relative w-full md:w-[420px] h-[280px] md:h-[320px] flex-shrink-0"
        >
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="flex-1 p-8 flex flex-col">
          <Link href={`/projects/${project.id}`} className="block flex-grow">
            <h3 className="text-2xl font-semibold mb-3 group-hover:text-purple-700 transition-colors">
              {project.title}
            </h3>
            <p className="text-gray-600 mb-6">{project.description}</p>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            {project.githubUrl && (
              <div className="flex items-center gap-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="text-sm">View Code</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
