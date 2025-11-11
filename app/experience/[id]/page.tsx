"use client"

import React, { useMemo, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@nextui-org/react"
import { Badge } from "@/components/ui/badge"
import Starfield from "@/components/effects/starfield"
import { experiences } from "@/lib/experience"
import { ArrowLeft, Home } from "lucide-react"
import { formatDateRange } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const expId = unwrappedParams.id
  const exp = experiences.find((e) => e.id === expId)

  if (!exp) return notFound()

  const [lightbox, setLightbox] = useState<{ open: boolean; src: string | null }>({ open: false, src: null })
  const [imgMeta, setImgMeta] = useState<Record<string, { w: number; h: number }>>({})

  const workExampleImages = useMemo(() => {
    const imgs = exp.workExamples?.slice(0, 2) || []
    if (imgs.length === 0 && exp.image) return [exp.image]
    return imgs
  }, [exp])

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
            <Link href="/experience">
              <Button variant="flat" className="text-gray-300 hover:text-white bg-transparent" startContent={<ArrowLeft className="h-4 w-4" />}>Back to Experience</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {exp.categories?.map((category) => (
                  <Badge key={category} className="bg-white/10 hover:bg-white/20 text-white">
                    {category}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent">
                {exp.title}
              </h1>

              <p className="text-lg text-gray-300">{exp.company} • {exp.location}</p>
              <p className="text-gray-400">{formatDateRange(exp.startDate, exp.endDate)}</p>

              <p className="text-xl text-gray-300">{exp.description}</p>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "tween", duration: 0.5, ease: "easeOut" }} className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-tr from-white/5 via-white/10 to-white/5">
              <Image src={exp.image || "/placeholder.svg?height=450&width=800"} alt={exp.title} fill className="object-contain" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] lg:grid-cols-[2fr_1.1fr] gap-12">
          {/* Main content (left) */}
          <div className="space-y-10">
            {/* About / Long description */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 underline decoration-purple-400 decoration-2 underline-offset-4">About</h2>
              <div className="prose prose-invert max-w-none">
                {exp.longDescription.split('\n\n').map((p, i) => (
                  <p key={i} className="text-gray-200 leading-relaxed">{p}</p>
                ))}
              </div>
            </section>

            {/* Projects section */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 underline decoration-purple-400 decoration-2 underline-offset-4">Projects</h2>
              {exp.projects && exp.projects.length > 0 ? (
                <div className="space-y-10">
                  {exp.projects.map((proj, i) => (
                    <motion.div
                      key={proj.title + i}
                      className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
                      whileHover={{ y: -2, boxShadow: "0 10px 30px rgba(99,102,241,0.15)" }}
                      transition={{ type: "tween", duration: 0.45, ease: "easeOut" }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold">{proj.title}</h3>
                      {proj.summary && (
                        <p className="text-gray-200">{proj.summary}</p>
                      )}
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="list-disc pl-6 text-gray-200 space-y-2">
                          {proj.bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {(proj.links && proj.links.length > 0) && (
                        <div className="flex flex-wrap gap-4 pt-1">
                          {proj.links.map((l) => (
                            <Link key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 underline underline-offset-4">
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      )}
                      {proj.videos && proj.videos.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {proj.videos.map((v, k) => (
                            v.youtubeId ? (
                              <div key={(v.youtubeId || "") + k} className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-white/10 bg-black">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                                  title={v.title || `${proj.title} video ${k + 1}`}
                                  className="absolute inset-0 w-full h-full"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                />
                              </div>
                            ) : null
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No specific projects listed yet.</p>
              )}
            </section>

            {/* Details section */}
            <section className="bg-white/10 backdrop-blur rounded-xl p-6 space-y-6 border border-white/10">
              <h3 className="text-lg font-bold border-b border-white/10 pb-3">Details</h3>
              <div className="space-y-4">
                {exp.tools?.length ? (
                  <div>
                    <h4 className="text-sm font-medium text-white/70">Technologies</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {exp.tools.map((tool) => (
                        <Badge key={tool} className="bg-white/10 text-white border border-white/20">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2">
                  {exp.websiteUrl && (
                    <Link href={exp.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-300 hover:text-purple-200">Website</Link>
                  )}
                  {exp.liveUrl && (
                    <Link href={exp.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-300 hover:text-purple-200">Live</Link>
                  )}
                  {exp.githubUrl && (
                    <Link href={exp.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-300 hover:text-purple-200">Code</Link>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Work Examples */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white/90">Work Examples</h3>
              <div className="space-y-6">
                {(workExampleImages.length ? workExampleImages : ["/placeholder.svg?height=800&width=800"]).slice(0,2).map((src, i) => (
                  <motion.button
                    key={src + i}
                    className="w-full text-left"
                    whileHover={{ scale: 1.008 }}
                    transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
                    onClick={() => setLightbox({ open: true, src })}
                  >
                    {(() => {
                      const meta = imgMeta[src]
                      const isShort = meta ? (meta.h < 260 || (meta.w / Math.max(1, meta.h)) > 1.6) : false
                      const maxW = isShort ? "md:max-w-[520px] lg:max-w-[640px]" : "md:max-w-[336px] lg:max-w-[420px]"
                      return (
                        <img
                          src={src}
                          alt={`${exp.title} example ${i + 1}`}
                          className={`block rounded-lg border border-white/10 shadow-sm max-w-full h-auto ${maxW}`}
                          decoding="async"
                          loading="lazy"
                          onLoad={(e) => {
                            const t = e.currentTarget
                            setImgMeta((m) => ({ ...m, [src]: { w: t.naturalWidth, h: t.naturalHeight } }))
                          }}
                        />
                      )
                    })()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Details moved to left column */}
          </div>
        </div>
      </div>
      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox({ open: false, src: null })}
          >
            <motion.div
              className="relative w-auto max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.src && (
                <img src={lightbox.src} alt="Work example" className="max-w-[90vw] max-h-[90vh] w-auto h-auto block rounded-lg" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

