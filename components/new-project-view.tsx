"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { api } from "@/api/api"
import { toast } from "react-toastify"

export function NewProjectView() {
  const params = useSearchParams()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enviroment: "production",
    language: "nodejs",
    token: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateProject = async () => {
    if (formData.name.trim()) {
      if (params.get('id')) {
        await api.put(`/projects/${params.get('id')}`, formData)
      } else {
        await api.post('/projects', formData)
      }

      toast.success(`Project ${params.get('id') ? 'updated' : 'created'} successfully!`)
      window.location.href = '/projects'
    }
  }

  useEffect(() => {
    const id = params.get('id')
    if (id) {
      (async () => {
        const response = await api.get(`/projects/${id}`)

        setFormData({
          name: response.data.name,
          description: response.data.description,
          enviroment: response.data.enviroment,
          language: response.data.language,
          token: response.data.token,
        })
      })()
    }
  }, [])

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 sm:px-6 py-4">
        <Link href="/projects">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={18} />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{params.get('id') ? 'Edit Project' : 'Create New Project'}</h1>
            <p className="text-muted-foreground">
              {params.get('id')
                ? 'Update your project details and settings'
                : 'Set up a new project to start monitoring your application'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Step 1 - Basic Info */}
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-sm font-semibold mb-2">Project Name</label>
                <Input
                  name="name"
                  placeholder="My Awesome App"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-card border-border text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">Choose a memorable name for your project</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe what this project does..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">Optional but helpful for team members</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Environment</label>
                <select
                  name="enviroment"
                  value={formData.enviroment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Language / Framework</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="nodejs">Node.js</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="dotnet">.NET</option>
                  <option value="php">PHP</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Token API</label>
                <textarea
                  name="token"
                  placeholder="Enter your API token..."
                  value={formData.token}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                />
              </div>

              <Button onClick={() => handleCreateProject()} className="cursor-pointer w-full bg-primary hover:bg-primary/90 h-11">
                {params.get('id') ? 'Update Project' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
