"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProjectForm } from "@/components/project-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)

    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    router.push("/projects")
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Add New Portfolio Project</h1>
          <p className="text-gray-500 mt-2">Document your personal project and what you've learned</p>
        </div>

        <ProjectForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
