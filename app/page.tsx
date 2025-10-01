"use client"

import Link from "next/link"
import Image from "next/image"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button } from "@nextui-org/react" 
import { projects } from "@/lib/data"
import { ArrowRight, Github, Linkedin } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import Constellation from "@/components/effects/constellation"
import Starfield from "@/components/effects/starfield"
import SkillsPengu from "@/components/skills-section"

export default function Home() {
  // Recent projects for the home page (show 4 in a zig-zag layout) — clone before sort to avoid mutating shared module state
  const featuredProjects = [...projects]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 4)

  // Contact form UI state
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    setErrorMsg(null)

    try {
      const form = e.currentTarget
      const formData = new FormData(form)
      const payload = {
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        company: String(formData.get("company") || "").trim(), // honeypot
      }

      // simple client-side validation for immediate UX
      if (payload.company) {
        // bot detected, pretend success
        setStatus("success")
        form.reset()
        return
      }
      if (payload.name.length < 2) throw new Error("Please enter your name.")
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw new Error("Please enter a valid email.")
      if (payload.message.length < 10) throw new Error("Message should be at least 10 characters.")

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message. Please try again.")
      }

      setStatus("success")
      form.reset()
    } catch (err: any) {
      setStatus("error")
      setErrorMsg(err?.message || "Something went wrong. Please try again later.")
    } finally {
      // Keep success visible; reset error/loading back to idle after short delay
      if (status !== "success") {
        setTimeout(() => setStatus("idle"), 2000)
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="top" className="w-full py-24 md:py-32 bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
        {/* Constellation background */}
        <Constellation className="absolute inset-0 pointer-events-none opacity-70" density={1.1} maxDistance={160} speed={0.35} />
        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.28)_0%,transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(109,40,217,0.22)_0%,transparent_40%)]" />
        </div>

        {/* TFT Penguin */}
        <motion.div 
          className="absolute top-6 right-6 z-20"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1, type: "spring", stiffness: 100 }}
          whileHover={{ scale: 1.05, x: -10 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            className="cursor-pointer transition-all duration-300"
            onClick={() => window.open("https://lolchess.gg/profile/na/hermano727-lmao/set13", "_blank")}
            title="TFT #1 Enthusiast! 🐧"
          >
            <Image
              src="/assets/tft-pengu.jpg"
              alt="TFT Penguin"
              width={80}
              height={80}
              className="rounded-full border-2 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            />
          </button>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
            {/* Text */}
            <motion.div 
              className="text-center md:text-left md:w-3/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Designing intuitive, impactful software
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-300/90 mb-8 max-w-xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                Full-stack developer <br />
                Mathematics & Computer Science @ UC San Diego
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href="/projects" className="block">
                  <Button 
                    className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg 
                    transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 w-full sm:w-auto" 
                    size="lg"
                    radius="full" 
                    endContent={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    variant="shadow"
                    disableRipple={false}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    View Projects
                  </Button>
                </Link>
                <Link href="/experience" className="block">
                  <Button 
                    className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg 
                    transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 w-full sm:w-auto" 
                    size="lg"
                    radius="full" 
                    endContent={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    variant="shadow"
                    disableRipple={false}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    View Experience
                  </Button>
                </Link>
                <a
                  href="/assets/Herman_Hundsberger_Resume.pdf"
                  download="Herman_Hundsberger_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="text-lg font-semibold bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg
                    hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 w-full sm:w-auto" 
                    size="lg" 
                    radius="full"
                    disableRipple={false}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    startContent={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-y-1 transition-transform"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    }
                  >
                    Download Resume
                  </Button>
                </a>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="flex items-center gap-4 mt-8 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link href="https://github.com/Hermano727" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-9 w-9" />
                </Link>
                <Link href="http://linkedin.com/in/herman-hundsberger-577600295" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-9 w-9" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div 
              className="flex justify-center md:justify-end md:w-2/5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-44 h-44 md:w-60 md:h-60 rounded-full overflow-hidden border-4 border-purple-500/20">
                <Image
                  src="/assets/pfp.jpg"
                  alt="Profile picture"
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </section>

      {/* Skills */}
      <section className="relative w-full pt-20 pb-28 text-white bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
        {/* Starfield overlay for skills */}
        <Starfield className="absolute inset-0 pointer-events-none" density={0.9} speed={0.08} color="rgba(255,255,255,0.25)" />
        <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
          <SkillsPengu />
        </div>
      </section>

      {/* Projects (zig-zag) */}
      <section className="relative w-full pt-16 pb-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
        <Starfield className="absolute inset-0 pointer-events-none z-0" density={0.9} speed={0.08} color="rgba(255,255,255,0.25)" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 z-10">
          <motion.div
            className="mb-14 md:-ml-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent">Recent Projects</h2>
          </motion.div>

          <div className="space-y-24">
            {featuredProjects.map((project, index) => {
              const reversed = index % 2 === 1
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative">
                    {/* Accent block behind the image, aligned to the image side */}
                    <div
                      aria-hidden
                      className={`absolute -inset-x-6 md:inset-y-[-48px] h-[220px] md:h-[340px] rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 opacity-25 ${
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
                          className="object-cover"
                        />
                      </div>

                      {/* Text */}
                      <div className={`${reversed ? 'md:col-start-1 md:col-span-7 md:text-right' : 'md:col-start-6 md:col-span-7'}`}>
                        <h3 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h3>
                        <p className={`text-gray-300 mb-6 max-w-2xl ${reversed ? 'ml-auto' : ''}`}>{project.description}</p>
                        <div className={`flex items-center gap-6 text-sm tracking-wide ${reversed ? 'justify-end' : ''}`}>
                          {project.liveUrl && (
                            <button
                              type="button"
                              onClick={() => window.open(project.liveUrl!, '_blank', 'noopener,noreferrer')}
                              className="uppercase text-white/90 hover:text-white border-b border-transparent hover:border-white/70 pb-0.5"
                            >
                              Live App
                            </button>
                          )}
                          <Link
                            href={`/projects/${project.id}`}
                            className="uppercase text-white/90 hover:text-white border-b border-white/60 pb-0.5"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div 
            className="flex justify-center mt-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link href="/projects">
              <Button 
                className="relative inline-flex items-center justify-center font-medium text-white px-6 py-2 rounded-md bg-gradient-to-r from-purple-700 via-purple-800 to-purple-950 hover:from-purple-600 hover:via-purple-700 hover:to-purple-900 shadow-lg"
                endContent={<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                radius="sm"
                variant="shadow"
                disableRipple={false}
              >
                View All Projects
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="relative w-full py-24 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
        <Starfield className="absolute inset-0 pointer-events-none" density={0.9} speed={0.08} color="rgba(255,255,255,0.25)" />
        <div className="relative max-w-7xl mx-auto px-16 md:px-24 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent">Get in Touch</h2>
              <p className="text-xl text-gray-300">
                Interested in working together? Feel free to reach out to discuss potential collaborations or
                opportunities.
              </p>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-700/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-400"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <a href="mailto:hh727w@gmail.com" className="text-white hover:text-purple-400 transition-colors">
                      hh727w@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-700/20 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-400"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <a href="tel:+1234567890" className="text-white hover:text-purple-400 transition-colors">
                      (510) 379-6874
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8">
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  {/* honeypot field for bots */}
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Your message"
                    ></textarea>
                  </div>

                  {/* Status feedback */}
                  <div role="status" aria-live="polite" className="text-sm min-h-5">
                    {status === "success" && (
                      <p className="text-green-400">Thanks! Your message has been sent.</p>
                    )}
                    {status === "error" && (
                      <p className="text-red-400">{errorMsg ?? "Something went wrong. Please try again."}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                    className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-16 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
        <Starfield className="absolute inset-0 pointer-events-none" density={0.9} speed={0.08} color="rgba(255,255,255,0.25)" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 flex flex-col items-center gap-6">
          {/* Back to top arrow */}
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

          {/* Socials */}
          <div className="flex items-center gap-6">
            <Link href="https://github.com/Hermano727" target="_blank" className="text-gray-300 hover:text-white transition-colors" aria-label="GitHub">
              <Github className="h-9 w-9" />
            </Link>
            <Link href="http://linkedin.com/in/herman-hundsberger-577600295" target="_blank" className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-9 w-9" />
            </Link>
          </div>

          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Herman Hundsberger</p>
        </div>
      </footer>
    </div>
  )
}
