"use client"

import { useState } from "react"
import Link from "next/link"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button } from "@nextui-org/react"
import { Input } from "@/components/ui/input"
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Filter, Search, X, Sparkles, ChevronDown, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-16 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.4)_0%,transparent_40%)] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(109,40,217,0.4)_0%,transparent_40%)] animate-pulse" style={{ animationDelay: "1s" }}></div>
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
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
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
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.open("/resume.pdf", "_blank")
                }}
              >
                <Button 
                  className="bg-gradient-to-tr from-purple-500 to-purple-700 text-white shadow-md"
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  }
                >
                  Download Resume
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>

      <div className="container px-4 md:px-6 py-12">
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
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-purple-600">{filteredProjects.length}</span> 
              {filteredProjects.length === 1 ? "Project" : "Projects"}
              {selectedTag && (
                <span className="font-normal text-gray-500 flex items-center gap-1">
                  with <span className="font-medium text-black">{selectedTag}</span>
                </span>
              )}
            </h2>
          </div>
        </motion.div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
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
    </div>
  )
}
