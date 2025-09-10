"use client"

import React from 'react';
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Github } from "lucide-react"
import type { Project } from "@/lib/data"
import { Button } from './ui/button';

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full">
      <div className="flex flex-col h-full">
        <Link
          href={`/projects/${project.id}`}
          className="relative w-full h-[200px] bg-gray-100 flex-shrink-0"
        >
          <Image
            src={project.image || "/placeholder.png"}
            alt={project.title}
            className="object-cover hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        <div className="flex-1 p-6 flex flex-col">
          <Link 
            href={`/projects/${project.id}`} 
            className="block flex-grow group/link"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover/link:text-purple-700 transition-colors line-clamp-2">
              {project.title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm line-clamp-3">{project.description}</p>
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.categories && project.categories.slice(0, 3).map((category) => (
              <Badge 
                key={category} 
                variant="secondary"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-xs"
              >
                {category}
              </Badge>
            ))}
            {project.categories && project.categories.length > 3 && (
              <Badge 
                variant="secondary"
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-xs"
              >
                +{project.categories.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white bg-purple-600 hover:bg-purple-700 transition-colors font-medium rounded-md px-3 py-1.5 text-xs"
              >
                <span>Live Demo</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium rounded-md px-3 py-1.5 text-xs"
              >
                <Github className="h-3 w-3" />
                <span>Code</span>
              </a>
            )}
          </div>

          <div className="mt-auto">
            <Link href={`/projects/${project.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                View Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
