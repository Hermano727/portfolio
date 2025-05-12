"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { projects } from "@/lib/data"
import { ArrowLeft, Calendar, Edit, ExternalLink, Github, PenToolIcon as Tool, Home } from "lucide-react"
import { motion } from "framer-motion"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const projectId = parseInt(unwrappedParams.id)
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    notFound()
  }

  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="container px-4 md:px-6 py-12">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative group rounded-full bg-white/5 hover:bg-white/10 transition-all"
                aria-label="Go to homepage"
              >
                <span className="absolute inset-0 rounded-full bg-purple-600/20 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                <Home className="h-5 w-5 text-white transition-all group-hover:scale-110" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="gap-1 text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tags && project.tags.map((tag) => (
                  <Badge key={tag} className="bg-white/10 hover:bg-white/20 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>

              <p className="text-xl text-gray-300">{project.description}</p>

              <div className="flex flex-wrap gap-3 pt-4">
                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1 bg-purple-700 hover:bg-purple-800 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1 border-white/20 text-white bg-white/10 hover:bg-white/20 transition-colors">
                      <Github className="h-4 w-4" />
                      View Code
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={project.imageUrl || "/placeholder.svg?height=450&width=800"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className={`rounded-md ${activeTab === "overview" ? "bg-black text-white" : ""}`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className={`rounded-md ${activeTab === "details" ? "bg-black text-white" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </TabsTrigger>
              </TabsList>

              {activeTab === "overview" && (
                <TabsContent value="overview" className="pt-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
                    <p className="text-lg leading-relaxed">{project.description}</p>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "details" && (
                <TabsContent value="details" className="pt-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="space-y-6">
                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-black"></div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">Project Details</h4>
                          </div>
                          <p className="text-gray-600">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold border-b pb-3">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Technologies</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tags && project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {project.githubUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Repository</h4>
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="mt-2 inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
                    >
                      <Github className="h-4 w-4" />
                      View Source Code
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
