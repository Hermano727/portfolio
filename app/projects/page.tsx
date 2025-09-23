"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button } from "@nextui-org/react"
import { Input } from "@/components/ui/input"
import { projects } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, X, Sparkles, ChevronDown, Home, Github, Linkedin } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Starfield from "@/components/effects/starfield"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique tags
  const tags = Array.from(
    new Set(projects.flatMap((project) => project.categories || []))
  )

  // Filter projects based on search query and selected tag
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag 
      ? project.categories && project.categories.includes(selectedTag) 
      : true

    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="bg-black text-white py-16 relative overflow-hidden">
        {/* Starfield + gradient */}
        <div className="absolute inset-0 opacity-30">
          <Starfield className="absolute inset-0 pointer-events-none" density={0.7} speed={0.12} color="rgba(255,255,255,0.35)" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.35)_0%,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(109,40,217,0.25)_0%,transparent_40%)]"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/">
              <Button 
                isIconOnly
                className="bg-white/10 text-white w-10 h-10 rounded-full"
                variant="flat"
                aria-label="Go to homepage"
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Project Collection
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Browse through all projects, filter by tag, or search for specific ones.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative w-full sm:w-auto flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-purple-500" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="flat"
                className={`bg-white/10 text-white hover:bg-white/20 transition-all ${showFilters ? 'bg-white/20' : ''}`}
                startContent={showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
                {selectedTag && (
                  <span className="ml-2 flex h-2 w-2 rounded-full bg-purple-500"></span>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>

      <div className="container px-4 md:px-6 py-14">
        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Filter by Tag
                  </h3>
                  <Button
                    variant="light"
                    size="sm"
                    className="text-gray-500 hover:text-black transition-colors"
                    onClick={() => setSelectedTag(null)}
                  >
                    Clear filters
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedTag === tag 
                          ? "bg-black text-white hover:bg-purple-600" 
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}

        {filteredProjects.length > 0 ? (
          <div className="space-y-24">
            {filteredProjects.map((project, index) => {
              const reversed = index % 2 === 1
              return (
                <Link key={project.id} href={`/projects/${project.id}`} className="block group" prefetch>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="relative">
                      {/* Accent block behind the image, aligned to the image side */}
                      <div
                        aria-hidden
                        className={`absolute -inset-x-6 md:inset-y-[-48px] h-[220px] md:h-[340px] rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 opacity-20 ${
                          reversed ? 'right-0 md:left-1/2' : 'left-0 md:right-1/2'
                        }`}
                      />

                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                        {/* Image */}
                        <div className={`${reversed ? 'md:col-start-8 md:col-span-5' : 'md:col-span-5'} relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-xl shadow-lg`}>
                          <Image
                            src={project.image || '/placeholder.png'}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>

                        {/* Text */}
                        <div className={`${reversed ? 'md:col-start-1 md:col-span-7 md:text-right' : 'md:col-start-6 md:col-span-7'}`}>
                          <h3 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h3>
                          <p className={`text-gray-300 mb-6 max-w-2xl ${reversed ? 'ml-auto' : ''}`}>{project.description}</p>
                          {project.tools?.length ? (
                            <div className={`flex flex-wrap gap-2 mb-6 ${reversed ? 'justify-end' : ''}`}>
                              {project.tools.slice(0, 6).map((t) => (
                                <span key={t} className="inline-flex items-center rounded-md border border-purple-300/40 bg-purple-200/10 text-purple-200 px-2 py-0.5 text-xs">
                                  {t}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <div className={`flex flex-wrap items-center gap-5 ${reversed ? 'justify-end' : ''}`}>
                            {project.liveUrl && (
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.liveUrl!, '_blank', 'noopener,noreferrer') }}
                                className="uppercase text-white/90 hover:text-white border-b border-transparent hover:border-white/70 pb-0.5"
                              >
                                Live App
                              </button>
                            )}
                            {project.githubUrl && (
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.githubUrl!, '_blank', 'noopener,noreferrer') }}
                                className="uppercase text-white/90 hover:text-white border-b border-white/60 pb-0.5"
                              >
                                View Code
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium">No projects found</h3>
            <p className="text-gray-500 mt-2 mb-6">Try adjusting your search or filters</p>
            <Button
              variant="flat"
              className="bg-gray-50 hover:bg-gray-100"
              onClick={() => {
                setSearchQuery("")
                setSelectedTag(null)
              }}
            >
              Reset All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Footer (copied from home) */}
      <footer className="relative w-full py-16 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
        <Starfield className="absolute inset-0 pointer-events-none" density={0.9} speed={0.08} color="rgba(255,255,255,0.25)" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 flex flex-col items-center gap-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="group inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            title="Back to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-white group-hover:-translate-y-0.5 transition-transform">
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </svg>
          </button>
          <div className="flex items-center gap-6">
            <Link href="https://github.com/Hermano727" target="_blank" className="text-gray-300 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="h-9 w-9" />
            </Link>
            <Link href="http://linkedin.com/in/herman-hundsberger-577600295" target="_blank" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-9 w-9" />
            </Link>
            <Link href="/#contact" className="ml-4">
              <Button className="bg-purple-700 hover:bg-purple-800 text-white" radius="md">Contact Me</Button>
            </Link>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Herman Hundsberger</p>
        </div>
      </footer>
    </div>
  )
}
