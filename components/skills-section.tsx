"use client"

import Image from "next/image"
import Starfield from "@/components/effects/starfield"

// Skills pulled from /public/assets/skills. Use only these.
const skills = [
  { name: "Python", src: "/assets/skills/python.png" },
  { name: "C++", src: "/assets/skills/c++.png" },
  { name: "Java", src: "/assets/skills/java.svg" },
  { name: "JavaScript", src: "/assets/skills/javascript.png" },
  { name: "SQL", src: "/assets/skills/sql.png" },
  { name: "Go", src: "/assets/skills/go.png" },
  { name: "React", src: "/assets/skills/react.png" },
  { name: "FastAPI", src: "/assets/skills/fastapi.png" },
  { name: "Docker", src: "/assets/skills/docker.jpg" },
  { name: "MongoDB", src: "/assets/skills/mongo.png" },
]

export default function SkillsPengu() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Left: Title & blurb (no card; clean underline and shifted further left) */}
      <div className="order-2 md:order-1 md:-ml-65">
        <div className="inline-block border-b border-white/70 text-white/90 uppercase tracking-widest text-sm md:text-lg mb-4 pb-1">
          Skills
        </div>
        <h3 className="text-4xl md:text-5xl leading-tight font-extrabold mb-5 bg-gradient-to-r from-purple-200 via-indigo-200 to-sky-200 bg-clip-text text-transparent md:whitespace-nowrap">
          A snapshot of my toolkit
        </h3>
        <div className="flex flex-col space-y-5 md:space-y-6">
          <p className="text-base md:text-xl text-gray-300 md:whitespace-nowrap">Focused set of languages, frameworks, and platforms I use to build software.</p>
        </div>
      </div>

      {/* Right: Basic 2-3-3-2 grid of 10 skills (icon-only), shifted left and slightly smaller */}
      <div className="relative order-1 md:order-2 md:ml-18">
        <Starfield className="absolute inset-0 opacity-20" density={0.7} speed={0.06} color="rgba(255,255,255,0.25)" />
        <div className="relative w-full max-w-[640px] md:max-w-[720px] lg:max-w-[780px]">
          <div className="grid grid-cols-3 gap-4 md:gap-7">
            {(() => {
              const layout = [
                { row: 1, col: 1 }, { row: 1, col: 3 },
                { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
                { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 },
                { row: 4, col: 1 }, { row: 4, col: 3 },
              ] as const
              return layout.map((pos, i) => {
                const t = skills[i]
                return (
                  <div
                    key={t.name}
                    className="relative aspect-square rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-sm shadow-inner overflow-hidden hover:border-purple-400/60 hover:shadow-purple-500/20 transition-transform duration-200 hover:scale-[1.03]"
                    style={{ gridColumn: `${pos.col} / span 1`, gridRow: `${pos.row}` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-[76%] h-[76%] md:w-[80%] md:h-[80%]">
                        <Image src={t.src} alt={t.name} fill className="object-contain" sizes="200px" />
                      </div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
