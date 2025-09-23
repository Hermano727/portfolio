"use client"

// Curated skills: languages, frameworks/libraries, and core concepts
// You can replace the placeholder icon boxes with real assets later.

type Skill = { name: string; category: "Language" | "Framework" | "Concept" }

const curated: Skill[] = [
  // Languages
  { name: "Python", category: "Language" },
  { name: "C", category: "Language" },
  { name: "C++", category: "Language" },
  { name: "Java", category: "Language" },
  { name: "JavaScript", category: "Language" },
  { name: "TypeScript", category: "Language" },
  { name: "Go", category: "Language" },
  { name: "SQL", category: "Language" },
  { name: "HTML", category: "Language" },
  { name: "CSS", category: "Language" },
  // Frameworks & libraries
  { name: "React", category: "Framework" },
  { name: "React Native", category: "Framework" },
  { name: "Next.js", category: "Framework" },
  { name: "Node.js", category: "Framework" },
  { name: "Flask", category: "Framework" },
  { name: "Docker", category: "Framework" },
  { name: "AWS", category: "Framework" },
  { name: "Linux", category: "Framework" },
  { name: "REST APIs", category: "Framework" },
  { name: "Git", category: "Framework" },
  // Concepts
  { name: "Cloud Platforms", category: "Concept" },
  { name: "Containers", category: "Concept" },
  { name: "Container Orchestration", category: "Concept" },
  { name: "CI/CD", category: "Concept" },
  { name: "Microservices", category: "Concept" },
  { name: "API Design", category: "Concept" },
  { name: "Test Automation", category: "Concept" },
]

export default function SkillsGrid() {
  const skills = curated
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {skills.map((skill) => (
        <div
          key={skill.name}
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 p-4">
            {/* Placeholder icon: replace /icons/{slug}.png later */}
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-purple-700 font-semibold">
              {abbr(skill.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-800">{skill.name}</p>
              <p className="text-xs text-gray-500">{skill.category}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function abbr(name: string) {
  // Simple abbreviation for placeholder icon text
  const words = name.split(/\s|\.|\+/).filter(Boolean)
  if (words.length === 1) {
    const w = words[0]
    return w.length <= 3 ? w.toUpperCase() : w.slice(0, 2).toUpperCase()
  }
  return (words[0][0] + words[1][0]).toUpperCase()
}
