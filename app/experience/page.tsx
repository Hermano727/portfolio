"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@nextui-org/react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { experiences } from "@/lib/experience"
import { Filter, Search, X, Sparkles, Home, Github, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function ExperiencePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get all unique tags
  const tags = Array.from(
    new Set(experiences.flatMap((experience) => experience.categories || []))
  )

  // Filter experiences based on search query and selected tag
  const filteredExperiences = experiences.filter((experience) => {
    const matchesSearch =
      experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experience.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag 
      ? experience.categories && experience.categories.includes(selectedTag) 
      : true

    return matchesSearch && matchesTag
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 relative overflow-hidden">
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
              Professional Experience
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Explore my professional journey, work experience, and career achievements.
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
                  placeholder="Search experience..."
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
                    Filter by Category
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
              <span className="text-purple-600">{filteredExperiences.length}</span> 
              {filteredExperiences.length === 1 ? "Position" : "Positions"}
              {selectedTag && (
                <span className="font-normal text-gray-500 flex items-center gap-1">
                  in <span className="font-medium text-black">{selectedTag}</span>
                </span>
              )}
            </h2>
          </div>
        </motion.div>

        {filteredExperiences.length > 0 ? (
          <div className="space-y-8">
            {filteredExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-80 h-64 lg:h-auto flex-shrink-0 bg-gray-100">
                    <Image
                      src={experience.image || "/placeholder.png"}
                      alt={experience.company}
                      className="object-cover"
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                    />
                  </div>
                  <div className="flex-1 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                          {experience.title}
                        </h3>
                        <div className="flex items-center gap-2 text-lg text-gray-600 mb-2">
                          <span className="font-medium">{experience.company}</span>
                          <span>•</span>
                          <span>{experience.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{experience.startDate}</span>
                          {experience.endDate && (
                            <>
                              <span>•</span>
                              <span>{experience.endDate}</span>
                            </>
                          )}
                          <span>•</span>
                          <Badge 
                            variant={experience.status === "Current" ? "default" : "secondary"}
                            className={experience.status === "Current" ? "bg-green-100 text-green-800" : ""}
                          >
                            {experience.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 lg:mt-0">
                        {experience.liveUrl && (
                          <a
                            href={experience.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white bg-purple-600 hover:bg-purple-700 transition-colors font-medium rounded-md px-3 py-1.5 text-sm"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View</span>
                          </a>
                        )}
                        {experience.githubUrl && (
                          <a
                            href={experience.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors font-medium rounded-md px-3 py-1.5 text-sm"
                          >
                            <Github className="h-3 w-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6">{experience.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {experience.categories.map((category) => (
                        <Badge 
                          key={category} 
                          variant="secondary"
                          className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {experience.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
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
            <h3 className="text-xl font-medium">No experience found</h3>
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
