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
  type Section = { title: string; body?: string; bullets?: string[] }
  const sections = useMemo(() => {
    if (!project) return [] as Section[]
    switch (project.id) {
      case "splitr":
        return [
          {
            title: "Inspiration (0%)",
            bullets: [
              "We kept running into awkward, slow bill‑splitting at restaurants and wanted a tool that removed friction at the table.",
              "Definition of done: reduce time‑to‑settle and make costs transparent; deliver a friendly, confident UX vs. just a raw OCR demo.",
            ],
          },
          {
            title: "Tech & Architecture (25%)",
            bullets: [
              "React Native + Expo Go for rapid iteration and on‑device testing; Firebase Auth (phone) for one‑tap onboarding and future history.",
              "Pipeline: Google Vision OCR → MistralAI converts to structured JSON → FastAPI/Python validates/normalizes → RN renders assignable items.",
              "I owned system design + UI: typed JSON contracts between RN and FastAPI, resilient loading/repair/edit states, consistent token/spacing system, and safe third‑party key injection.",
              "Fair‑split logic: tax/tip allocated proportionally; totals validated against OCR output with guardrails.",
            ],
          },
          {
            title: "Midway Challenges (50%)",
            bullets: [
              "LLM benchmarking: compared Llama3/OpenAI/Mistral on curated receipt images; selected Mistral for cost/latency/JSON reliability.",
              "Prompt/formatting issues: line breaks and multi‑quantity items initially broke schema parsing; we tightened the schema and added repair heuristics.",
              "Data flow reliability: large images device → backend → app; added compression caps, retries, and clear progress states.",
              "Product decision trade‑off: teammates wanted to pursue ~10% parsing accuracy gains; I proposed focusing the last 12 hours on a stronger MVP (Profile, History, polish) to impress judges.",
              "Execution: created a timeline, branched off, and owned the risk—worked through the night to avoid blocking core features.",
            ],
          },
          {
            title: "MVP Reached (75%)",
            bullets: [
              "Delivered Profile tab and receipt History backed by Firebase; persisted user data reliably by demo time.",
              "End‑to‑end flow: upload → extract → assign → fair split → final summary, all with clear UI states and minimal surprises.",
              "Reliability: ≈90%+ extraction on our test set; prioritized UX clarity over chasing marginal accuracy gains.",
              "Outcome: shipped a cohesive demo that showcased real value, not just OCR.",
            ],
          },
          {
            title: "Finish & Next (100%)",
            bullets: [
              "Editable receipts to quickly fix OCR misreads before splitting.",
              "Full Firestore history, Venmo/Cash App integrations, and advanced split modes (percentages, shared items).",
              "Accessibility polish and continuous prompt + pre‑processing improvements for diverse receipt formats.",
              "Personal takeaways: communicate trade‑offs early, define typed service contracts, design resilient UI states first, and take ownership when making bold scope calls.",
            ],
          },
        ]
        
      case "crisis-compass":
        return [
          {
            title: "Inspiration (0%)",
            bullets: [
              "Wildfire impact on friends and family made it hard to quickly find credible, nearby help.",
              "We scoped a tool that reduces search time under stress: a map of vetted resources + lightweight city‑scoped chat.",
              "Design target: load fast on spotty connections, make first action obvious (Search → See resources → Get directions).",
            ],
          },
          {
            title: "Tech & Architecture (25%)",
            bullets: [
              "React front‑end with a typed component layer; deployed via AWS Amplify for quick, repeatable releases.",
              "Google Places/Maps integration for autocomplete and nearby search; React Google Maps Library for rendering.",
              "Supabase backs lightweight, city‑scoped real‑time chat so neighbors can share updates.",
              "My role: system design + UI + Google Places integration. I migrated an HTML/Flask proof‑of‑concept into idiomatic React components, established a safe API‑key injection pattern, and defined the map/places hook API our UI consumes.",
            ],
          },
          {
            title: "Midway Challenges (50%)",
            bullets: [
              "Integration hurdles: the original Places demo was a plain HTML script. Porting to React initially failed to mount, and keys wouldn’t load.",
              "Resolution: paired with the team, studied Google docs + examples, split init into a React provider and hooks, and moved key management to environment configs.",
              "First hackathon dynamics: role clarity and speed. We created small, testable slices (search box, map marker list, chat channel) so work could proceed in parallel.",
              "Sparse library docs: relied on source reading and minimal repros to verify behaviors (e.g., debounced autocomplete, map re‑center on query).",
            ],
          },
          {
            title: "MVP Reached (75%)",
            bullets: [
              "Resource discovery: users type a place or use current location → we show nearby hospitals, shelters, food banks, etc.",
              "City‑scoped real‑time chat for coordination without information overload.",
              "Resource links page for quick access to official alerts and help portals.",
              "Shipped under time with a clean, accessible UI and sensible empty/loading states.",
            ],
          },
          {
            title: "Finish & Next (100%)",
            bullets: [
              "Danger‑zone API: live notifications, evacuation routes, and highlighted zones overlayed on the map.",
              "Mobile experience: deliver a PWA/native shell for offline‑first access during outages.",
              "Operational hardening: rate‑limit guards, retries, and telemetry on Places requests; secrets rotation and key scoping.",
              "UX depth: saved searches, resource filters, and clearer confidence/updated‑time signals on results.",
            ],
          },
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

  // Progress (0,25,50,75,100) and section refs
  const [progress, setProgress] = useState(0)
  const sectionRefs = useRef<HTMLElement[]>([])
  const storyContainerRef = useRef<HTMLDivElement | null>(null)

  // Per-project gallery images (user-provided assets)
  const galleryImages = useMemo(() => {
    if (!project) return [] as string[]
    switch (project.id) {
      case "splitr":
        return [
          "/assets/projects/splitr-profile.png",
          "/assets/projects/splitr-bill.jpg",
        ]
      case "crisis-compass":
        return [
          "/assets/projects/cc-map.jpg",
          "/assets/projects/cc-chat.jpg",
        ]
      default:
        return project.image ? [project.image] : []
    }
  }, [project])

  // Only show the left-column gallery if we have at least 3 assets to make it feel full
  const showGallery = useMemo(() => galleryImages.length >= 3, [galleryImages.length])

  // Compute progress based on scroll position relative to the story area.
  // We snap to the nearest 25% step.
  useEffect(() => {
    const onScroll = () => {
      const container = storyContainerRef.current
      if (!container) return

      // Ensure 0% at the very top of the page regardless of initial layout
      if (window.scrollY <= 2) {
        setProgress(0)
        return
      }

      const rect = container.getBoundingClientRect()
      const containerTop = rect.top + window.scrollY
      const containerBottom = containerTop + container.scrollHeight

      // Use the bottom of the viewport so 100% occurs when the bottom of
      // the viewport reaches the bottom of the story container.
      const viewportTop = window.scrollY
      const viewportBottom = viewportTop + window.innerHeight

      // If we're above the story, 0; when bottom reaches story bottom, 100
      const raw = viewportBottom <= containerTop
        ? 0
        : viewportTop >= containerBottom
          ? 1
          : (viewportBottom - containerTop) / (containerBottom - containerTop)

      const pct = Math.max(0, Math.min(100, Math.round(raw * 100)))
      // Snap to nearest 25
      const snapped = Math.round(pct / 25) * 25
      setProgress(snapped)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
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
                          {s.body && <p className="text-gray-200 leading-relaxed">{s.body}</p>}
                          {s.bullets && (
                            <ul className="list-disc pl-6 text-gray-200 space-y-2">
                              {s.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          )}
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

                      {showGallery && (
                        <section className="pt-6 space-y-4">
                          <h3 className="text-2xl md:text-3xl font-bold">Gallery</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {galleryImages.slice(0,4).map((src, i) => (
                              <div key={src + i} className="relative w-full h-[360px] rounded-xl overflow-hidden bg-white/5 ring-1 ring-white/10">
                                <Image
                                  src={src}
                                  alt={`${project.title} screenshot ${i + 1}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ))}
                          </div>
                        </section>
                      )}
                    </div>

                    {/* Right: vertical progress rail (integrated with details container) */}
                    <aside className="hidden lg:block">
                      <div className="sticky top-24">
                        <h4 className="mb-4 text-sm uppercase tracking-widest text-white/70">Progress</h4>
                        {/* Make the rail fill the visible right column height (entire right side of the screen area). */}
                        <div className="relative w-40" style={{ height: "calc(100vh - 6rem)" }}>
                          {/* Track (thicker and centered) */}
                          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 rounded bg-white/25" />
                          {/* Fill from top (0%) downward, centered on the same axis */}
                          <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-2 rounded-t bg-cyan-500 transition-[height] duration-300 ease-out"
                            style={{ height: `${progress}%` }}
                          />

                          {/* Moving indicator dot aligned to the rail center */}
                          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 ease-out" style={{ top: `${progress}%` }}>
                            <div className="absolute -mt-2 h-4 w-4 rounded-full bg-cyan-500 shadow-[0_0_0_5px_rgba(6,182,212,0.20)]" />
                          </div>

                          {/* Steps with labels: 0% at top, 100% at bottom */}
                          {[0,25,50,75,100].map((p, i) => {
                            const activeIdx = Math.round(progress / 25)
                            const isCompleted = i <= activeIdx
                            return (
                              <div key={p} className="absolute inset-x-0" style={{ top: `${p}%` }}>
                                {/* Dot centered on the rail */}
                                <div className={`absolute left-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full border ${isCompleted ? "bg-cyan-500 border-cyan-400 ring-4 ring-cyan-500/20" : "bg-white/40 border-white/60"}`} />
                                {/* Label shifted to the right of the rail */}
                                <div
                                  className={`absolute -mt-2 whitespace-nowrap ${isCompleted ? "text-white" : "text-white/70"} text-sm md:text-base`}
                                  style={{ left: "calc(50% + 18px)" }}
                                >
                                  {p}%
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

            {/* Additional Previews: large images without card chrome */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white/90">Additional Previews</h3>
              <div className="space-y-8">
                {(() => {
                  const imgs = galleryImages.length ? galleryImages : (project.image ? [project.image] : [])
                  return (imgs.length ? imgs : ["/placeholder.svg?height=800&width=600"]).slice(0,2).map((src, i) => {
                    const isPortrait = project.id === "splitr"
                    const aspect = isPortrait ? "aspect-[9/16]" : "aspect-video" // 16:9 default
                    return (
                      <div key={src + i} className="rounded-xl p-[2px] bg-gradient-to-tr from-purple-500/40 via-indigo-500/40 to-cyan-500/40">
                        <div className={`relative w-full ${aspect} rounded-[0.70rem] overflow-hidden`}>
                          <Image
                            src={src}
                            alt={`${project.title} preview ${i + 1}`}
                            fill
                            className="object-contain"
                            sizes="(min-width: 1024px) 360px, 100vw"
                          />
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
