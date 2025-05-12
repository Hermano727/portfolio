"use client"

import Link from "next/link"
import Image from "next/image"
import { Button as ShadcnButton } from "@/components/ui/button"
import { Button } from "@nextui-org/react" 
import { ProjectCard } from "@/components/project-card"
import { projects } from "@/lib/data"
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  // Get featured projects (most recent 3)
  const featuredProjects = projects.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 bg-black text-white relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(109,40,217,0.4)_0%,transparent_40%)] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(109,40,217,0.4)_0%,transparent_40%)] animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            {/* Text */}
            <motion.div 
              className="text-center md:text-left md:flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="block">Document</span>
                <span className="block">
                  Your <span className="text-purple-500 inline-block hover:scale-110 transition-transform">Journey</span>
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl mx-auto md:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Welcome to my portfolio. I showcase my personal projects, track my progress, and share what I've learned
                along the way.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href="/projects">
                  <Button 
                    className="text-lg font-semibold bg-gradient-to-r from-[#8A2BE2] to-[#9370DB] text-white shadow-lg 
                    transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40" 
                    size="lg"
                    radius="full" 
                    endContent={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    variant="shadow"
                    disableRipple={false}
                  >
                    View Projects
                  </Button>
                </Link>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open("/resume.pdf", "_blank")
                  }}
                >
                  <Button 
                    className="text-lg font-semibold bg-gradient-to-tr from-purple-500 to-purple-700 text-white shadow-lg
                    hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 
                    hover:from-purple-600 hover:to-purple-800" 
                    size="lg" 
                    radius="full"
                    disableRipple={false}
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
                </Link>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                className="flex items-center gap-4 mt-8 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link href="https://github.com/Hermano727" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="http://linkedin.com/in/herman-hundsberger-577600295" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div 
              className="flex justify-center md:justify-end md:flex-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-purple-500/20">
                <Image
                  src="/me.jpg"
                  alt="Profile picture"
                  width={256}
                  height={256}
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

      {/* Featured Projects */}
      <section className="w-full py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <motion.div 
            className="flex flex-col items-center text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              Featured Work
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Recent Projects</h2>
            <p className="text-gray-600 max-w-2xl">
              Explore my latest work and ongoing projects. Each project represents a unique challenge and learning opportunity.
            </p>
          </motion.div>

          <div className="space-y-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
                className="rounded-xl overflow-hidden"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/projects">
              <Button 
                className="bg-gradient-to-r from-black to-gray-800 text-white font-medium
                hover:shadow-xl transition-all duration-300 hover:scale-105
                hover:from-gray-900 hover:to-black"
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
      <section className="w-full py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-16 md:px-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Get in Touch</h2>
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
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
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
                        type="email"
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
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
