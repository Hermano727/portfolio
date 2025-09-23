"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button } from "@nextui-org/react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { projects } from "@/lib/data"
import { ArrowLeft, ExternalLink, Github, Home } from "lucide-react"
import { motion } from "framer-motion"
import Starfield from "@/components/effects/starfield"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const projectId = unwrappedParams.id
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    notFound()
  }

  const [activeTab, setActiveTab] = useState("overview")

  // Story sections for the Details tab
  const sections = useMemo(() => {
    if (!project) return [] as { title: string; body: string }[]
    switch (project.id) {
      case "splitr":
        return [
          { title: "Inspiration (0%)", body: "We kept running into annoying bill‑splitting at restaurants, so we built a tool to remove the friction and awkward math." },
          { title: "Tech & Architecture (25%)", body: "React Native + Expo Go for rapid iteration; Firebase Auth for phone sign‑in; Google Vision OCR parsed with MistralAI and a Python service to transform into components." },
          { title: "Midway Challenges (50%)", body: "OCR accuracy on messy receipts; normalizing item/price pairs from inconsistent layouts; piping image → backend → app reliably under time pressure." },
          { title: "MVP Reached (75%)", body: "End‑to‑end flow: upload receipt, extract items, assign to people, compute totals including tax/tip fairly with a smooth UX." },
          { title: "Finish & Next (100%)", body: "Editable receipt step, Firestore history, Venmo/CashApp integration, advanced split options, and UI polish." },
        ]
      case "crisis-compass":
        return [
          { title: "Inspiration (0%)", body: "Wildfire impact on friends/family motivated us to build a resource finder for crises." },
          { title: "Tech & Architecture (25%)", body: "React front‑end, Google Maps + React Google Maps Library for autocomplete/search, Supabase for live chat, deployed via AWS Amplify." },
          { title: "Midway Challenges (50%)", body: "First hackathon, role organization, sparse docs for the maps library, integrating features quickly." },
          { title: "MVP Reached (75%)", body: "Interactive map to nearby resources, real‑time city‑scoped chat, resource links page—all shipped under time." },
          { title: "Finish & Next (100%)", body: "Add danger‑zone API with live notifications and routes; deliver a mobile app for on‑the‑go access." },
        ]
      default:
        return [
          { title: "Inspiration (0%)", body: "Why this project exists and the problem we’re solving." },
          { title: "Tech & Architecture (25%)", body: "Stack choices, design trade‑offs, and the first implementation steps." },
          { title: "Midway (50%)", body: "Key problems, experiments, and collaboration details." },
          { title: "MVP (75%)", body: "How we reached something usable and validated it." },
          { title: "Finish (100%)", body: "Outcomes, next steps, and lessons learned." },
        ]
    }
  }, [project])

  // Progress based on section in view
  const [progress, setProgress] = useState(0) // 0..100
  const sectionRefs = useRef<HTMLElement[]>([])

  // Measure story container to match progress rail height
  const storyContainerRef = useRef<HTMLDivElement | null>(null)
  const [railHeight, setRailHeight] = useState<number>(520)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        // Choose the section with highest intersection ratio
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.idx)
          const pct = Math.min(100, Math.max(0, idx * 25))
          setProgress(pct)
        }
      },
      { root: null, rootMargin: "-20% 0px -55% 0px", threshold: [0.2, 0.4, 0.6, 0.8] }
    )
    sectionRefs.current.filter(Boolean).forEach((el) => obs.observe(el as Element))
    return () => obs.disconnect()
  }, [activeTab, sections.length])

  // Keep the rail height in sync with the left story column (no ResizeObserver to avoid feedback loops)
  useEffect(() => {
    const el = storyContainerRef.current
    if (!el) return

    const measure = () => {
      // Use scrollHeight to capture content height only, not stretched grid height
      const h = el.scrollHeight
      setRailHeight(h)
    }

    // Measure after paint
    const raf = requestAnimationFrame(measure)

    // Debounced resize handler
    let t: any
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(measure, 120)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [activeTab, sections.length])

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-x-hidden">
      <Starfield className="absolute inset-0 pointer-events-none" density={0.9} speed={0.08} color="rgba(255,255,255,0.25)" />

      {/* Header */}
      <div className="relative z-10">
        <div className="container px-4 md:px-6 py-12">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/">
              <Button isIconOnly variant="flat" className="bg-white/10 text-white rounded-full" aria-label="Go to homepage">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="flat" className="text-gray-300 hover:text-white bg-transparent" startContent={<ArrowLeft className="h-4 w-4" />}>
                Back to Projects
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {project.categories?.map((category) => (
                  <Badge key={category} className="bg-white/10 hover:bg-white/20 text-white">
                    {category}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                {project.title}
              </h1>

              <p className="text-xl text-gray-300">{project.description}</p>

              <div className="flex flex-wrap gap-3 pt-4">
                {project.liveUrl && (
                  <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-gradient-to-tr from-purple-600 to-purple-800 text-white shadow-lg font-medium hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-purple-900" size="sm" endContent={<ExternalLink className="h-4 w-4" />} radius="md">
                      Live Demo
                    </Button>
                  </Link>
                )}
                {project.githubUrl && (
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="flat" className="bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg" size="sm" startContent={<Github className="h-4 w-4" />} radius="md">
                      View Code
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image src={project.image || "/placeholder.svg?height=450&width=800"} alt={project.title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 p-1 rounded-lg">
                <TabsTrigger value="overview" className={`rounded-md ${activeTab === "overview" ? "bg-white text-black" : "text-white"}`} onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
                <TabsTrigger value="details" className={`rounded-md ${activeTab === "details" ? "bg-white text-black" : "text-white"}`} onClick={() => setActiveTab("details")}>Details</TabsTrigger>
              </TabsList>

              {activeTab === "overview" && (
                <TabsContent value="overview" className="pt-8">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-gray-200 whitespace-pre-line">{project.longDescription}</p>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "details" && (
                <TabsContent value="details" className="pt-8">
                  {/* Integrated two-column layout: story on the left, vertical progress rail on the right */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-start">
                    {/* Story sections */}
                    <div className="space-y-16" ref={storyContainerRef}>
                      {sections.map((s, idx) => (
                        <section
                          key={s.title}
                          data-idx={idx}
                          ref={(el) => { if (el) sectionRefs.current[idx] = el }}
                          className="scroll-mt-24"
                        >
                          <h3 className="text-2xl md:text-3xl font-bold mb-3">{s.title}</h3>
                          <p className="text-gray-200 leading-relaxed">{s.body}</p>
                        </section>
                      ))}

                      <section>
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">Key Takeaways</h3>
                        <ul className="list-disc pl-6 text-gray-200 space-y-2">
                          <li>Strong emphasis on rapid iteration and user‑centered design.</li>
                          <li>Clear architecture decisions accelerated delivery.</li>
                          <li>We had fun learning, shipping, and collaborating under pressure.</li>
                        </ul>
                      </section>
                    </div>

                    {/* Right: vertical progress rail (integrated with details container) */}
                    <aside className="hidden lg:block">
                      <div className="sticky top-24">
                        <h4 className="mb-4 text-sm uppercase tracking-widest text-white/70">Progress</h4>
                        <div className="relative" style={{ height: railHeight }}>
                          {/* Track */}
                          <div className="absolute inset-0 left-6 w-1 rounded bg-white/20" />
                          {/* Fill from top (0%) downward */}
                          <div
                            className="absolute top-0 left-6 w-1 rounded-t bg-cyan-500 transition-[height] duration-300 ease-out"
                            style={{ height: `${progress}%` }}
                          />

                          {/* Moving indicator dot */}
                          <div className="absolute left-0 right-0 pointer-events-none transition-all duration-300 ease-out" style={{ top: `${progress}%` }}>
                            <div className="absolute -mt-1.5 left-[26px] -translate-x-1/2 h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_0_4px_rgba(6,182,212,0.18)]" />
                          </div>

                          {/* Steps with labels: 0% at top, 100% at bottom */}
                          {[0,25,50,75,100].map((p, i) => {
                            const activeIdx = Math.round(progress / 25)
                            const isActive = i === activeIdx
                            return (
                              <div key={p} className="absolute left-0 right-0" style={{ top: `${p}%` }}>
                                <div className="flex items-center gap-3">
                                  <div className={`h-3 w-3 rounded-full border ${isActive ? "bg-cyan-500 border-cyan-400 ring-4 ring-cyan-500/20" : "bg-white/40 border-white/60"}`} />
                                  <div className={`text-xs ${isActive ? "text-white" : "text-white/70"}`}>{p}%</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </aside>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar column */}
          <div className="space-y-8">
            {/* Project Details card */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 space-y-6 border border-white/10">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white/70">Technologies</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tools?.map((tool) => (
                      <Badge key={tool} className="bg-white/10 text-white border border-white/20">{tool}</Badge>
                    ))}
                  </div>
                </div>
                {project.githubUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-white/70">Repository</h4>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-purple-300 hover:text-purple-200">
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
