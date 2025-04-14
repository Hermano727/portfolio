"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X } from "lucide-react"

interface ProjectFormProps {
  onSubmit: (data: any) => void
  isSubmitting: boolean
  initialData?: any
}

export function ProjectForm({ onSubmit, isSubmitting, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    longDescription: initialData?.longDescription || "",
    status: initialData?.status || "In Progress",
    startDate: initialData?.startDate || new Date().toISOString().split("T")[0],
    endDate: initialData?.endDate || "",
    progress: initialData?.progress || 0,
    categories: initialData?.categories || [],
    tools: initialData?.tools || [],
    githubUrl: initialData?.githubUrl || "",
    liveUrl: initialData?.liveUrl || "",
    image: initialData?.image || "",
    takeaways: initialData?.takeaways || [""],
    updates: initialData?.updates || [{ title: "", date: new Date().toISOString().split("T")[0], description: "" }],
  })

  const [newCategory, setNewCategory] = useState("")
  const [newTool, setNewTool] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleProgressChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, progress: value[0] }))
  }

  const addCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }))
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }))
  }

  const addTool = () => {
    if (newTool && !formData.tools.includes(newTool)) {
      setFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, newTool],
      }))
      setNewTool("")
    }
  }

  const removeTool = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t !== tool),
    }))
  }

  const handleTakeawayChange = (index: number, value: string) => {
    const newTakeaways = [...formData.takeaways]
    newTakeaways[index] = value
    setFormData((prev) => ({ ...prev, takeaways: newTakeaways }))
  }

  const addTakeaway = () => {
    setFormData((prev) => ({
      ...prev,
      takeaways: [...prev.takeaways, ""],
    }))
  }

  const removeTakeaway = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      takeaways: prev.takeaways.filter((_, i) => i !== index),
    }))
  }

  const handleUpdateChange = (index: number, field: string, value: string) => {
    const newUpdates = [...formData.updates]
    newUpdates[index] = { ...newUpdates[index], [field]: value }
    setFormData((prev) => ({ ...prev, updates: newUpdates }))
  }

  const addUpdate = () => {
    setFormData((prev) => ({
      ...prev,
      updates: [...prev.updates, { title: "", date: new Date().toISOString().split("T")[0], description: "" }],
    }))
  }

  const removeUpdate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      updates: prev.updates.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter project title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Brief description of your project"
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="longDescription">Detailed Description *</Label>
            <Textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              required
              placeholder="Detailed description of your project"
              className="resize-none"
              rows={5}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Status</h2>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Status</Label>
            <RadioGroup value={formData.status} onValueChange={handleStatusChange} className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Planning" id="planning" />
                <Label htmlFor="planning">Planning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="In Progress" id="in-progress" />
                <Label htmlFor="in-progress">In Progress</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Completed" id="completed" />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="On Hold" id="on-hold" />
                <Label htmlFor="on-hold">On Hold</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date (if completed)</Label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Progress ({formData.progress}%)</Label>
            </div>
            <Slider
              defaultValue={[formData.progress]}
              max={100}
              step={5}
              onValueChange={handleProgressChange}
              className="py-4"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories & Tools</h2>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="h-4 w-4 rounded-full hover:bg-gray-200 inline-flex items-center justify-center"
                    aria-label={`Remove ${category} category`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" onClick={addCategory} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Tools & Technologies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tools.map((tool) => (
                <Badge key={tool} variant="outline" className="flex items-center gap-1 bg-purple-50">
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeTool(tool)}
                    className="h-4 w-4 rounded-full hover:bg-gray-200 inline-flex items-center justify-center"
                    aria-label={`Remove ${tool} tool`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tool or technology"
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
              />
              <Button type="button" onClick={addTool} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Links & Media</h2>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="githubUrl">GitHub Repository URL</Label>
            <Input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="liveUrl">Live Demo URL</Label>
            <Input
              id="liveUrl"
              name="liveUrl"
              type="url"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://your-project.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Project Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Key Takeaways</h2>
          <Button type="button" onClick={addTakeaway} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Takeaway
          </Button>
        </div>

        <div className="grid gap-4">
          {formData.takeaways.map((takeaway, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={takeaway}
                onChange={(e) => handleTakeawayChange(index, e.target.value)}
                placeholder="What did you learn from this project?"
              />
              {formData.takeaways.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeTakeaway(index)}
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Progress Updates</h2>
          <Button type="button" onClick={addUpdate} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Update
          </Button>
        </div>

        <div className="grid gap-6">
          {formData.updates.map((update, index) => (
            <div key={index} className="grid gap-4 p-4 border rounded-lg relative">
              {formData.updates.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeUpdate(index)}
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="grid gap-2">
                <Label htmlFor={`update-title-${index}`}>Update Title</Label>
                <Input
                  id={`update-title-${index}`}
                  value={update.title}
                  onChange={(e) => handleUpdateChange(index, "title", e.target.value)}
                  placeholder="Milestone or update title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`update-date-${index}`}>Date</Label>
                <Input
                  id={`update-date-${index}`}
                  type="date"
                  value={update.date}
                  onChange={(e) => handleUpdateChange(index, "date", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`update-description-${index}`}>Description</Label>
                <Textarea
                  id={`update-description-${index}`}
                  value={update.description}
                  onChange={(e) => handleUpdateChange(index, "description", e.target.value)}
                  placeholder="Describe what you accomplished in this update"
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-purple-700 hover:bg-purple-800">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Add to Portfolio"
          )}
        </Button>
      </div>
    </form>
  )
}
