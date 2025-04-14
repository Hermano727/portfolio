"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { projects } from "@/lib/data"
import { ArrowLeft, Calendar, Edit, ExternalLink, Github, PenToolIcon as Tool } from "lucide-react"
import { motion } from "framer-motion"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id)

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
                {project.categories.map((category) => (
                  <Badge key={category} className="bg-white/10 hover:bg-white/20 text-white">
                    {category}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>

              <p className="text-xl text-gray-300">{project.description}</p>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-white/20 rounded-full h-2 w-24">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="text-sm">{project.progress}% Complete</span>
                </div>

                <Badge
                  className={`
                  ${
                    project.status === "Completed"
                      ? "bg-green-500"
                      : project.status === "In Progress"
                        ? "bg-purple-700"
                        : "bg-gray-700"
                  }
                `}
                >
                  {project.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link href={`/projects/${project.id}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1 border-white/20 text-white hover:bg-white/10">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="gap-1 bg-purple-700 hover:bg-purple-800">
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1 border-white/20 text-white hover:bg-white/10">
                      <Github className="h-4 w-4" />
                      View Code
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image
                src={project.image || "/placeholder.svg?height=450&width=800"}
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
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="rounded-md data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="progress"
                  className="rounded-md data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Progress
                </TabsTrigger>
                <TabsTrigger
                  value="takeaways"
                  className="rounded-md data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Takeaways
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{project.longDescription}</p>
                </motion.div>
              </TabsContent>

              <TabsContent value="progress" className="pt-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Project Timeline</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{project.progress}% Complete</span>
                      <Progress value={project.progress} className="w-24 h-2" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {project.updates.map((update, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-0 last:pb-0"
                      >
                        <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-black"></div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{update.title}</h4>
                            <Badge variant="outline" className="bg-gray-100">
                              <Calendar className="h-3 w-3 mr-1" />
                              {update.date}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{update.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="takeaways" className="pt-8">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <h3 className="text-xl font-bold">Key Takeaways</h3>
                  <div className="grid gap-4">
                    {project.takeaways.map((takeaway, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-800">{takeaway}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-bold border-b pb-3">Project Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Timeline</h4>
                  <p className="mt-1 font-medium">
                    {project.startDate} - {project.endDate || "Present"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    <Badge
                      variant={
                        project.status === "Completed"
                          ? "default"
                          : project.status === "In Progress"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        project.status === "Completed"
                          ? "bg-green-500"
                          : project.status === "In Progress"
                            ? "bg-purple-700"
                            : "bg-gray-200"
                      }
                    >
                      {project.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-2 border-b pb-3">
                <Tool className="h-5 w-5 text-black" />
                <h3 className="text-lg font-bold">Tools & Technologies</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="outline"
                    className="bg-white border-gray-200 text-gray-800 hover:bg-gray-100"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            {project.githubUrl && (
              <div className="bg-black text-white rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Repository
                </h3>
                <p className="text-gray-300 text-sm">View the source code and contribute to this project on GitHub.</p>
                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    View Repository
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
