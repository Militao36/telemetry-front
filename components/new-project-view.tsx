"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { api } from "@/api/api"
import { toast } from "react-toastify"

export function NewProjectView() {
  const params = useSearchParams()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    enviroment: "production",
    languageOrFramework: "nodejs",
    token: "",
    redactionFields: [] as string[],
  })
  const [redactionField, setRedactionField] = useState("")

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

  const addRedactionField = () => {
    const field = redactionField.trim().toLowerCase()

    if (!field) {
      return
    }

    if (formData.redactionFields.includes(field)) {
      setRedactionField("")
      return
    }

    if (formData.redactionFields.length >= 100) {
      toast.warn("You can add up to 100 custom redaction fields.")
      return
    }

    setFormData((prev) => ({
      ...prev,
      redactionFields: [...prev.redactionFields, field],
    }))
    setRedactionField("")
  }

  const removeRedactionField = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      redactionFields: prev.redactionFields.filter((item) => item !== field),
    }))
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
          languageOrFramework: response.data.languageOrFramework,
          token: response.data.token,
          redactionFields: response.data.redactionFields || [],
        })
      })()
    }
  }, [])

  return (
    <div className="app-shell flex flex-col">
      {/* Header */}
      <div className="modern-page-header">
        <Link href="/projects">
          <Button variant="outline" size="lg" className="gap-2 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm hover:border-primary/50 dark:bg-secondary/70">
            <ArrowLeft size={18} />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="app-content">
        <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="page-title mb-2">{params.get('id') ? 'Edit Project' : 'Create New Project'}</h1>
            <p className="page-subtitle">
              {params.get('id')
                ? 'Update your project details and settings'
                : 'Set up a new project to start monitoring your application'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Step 1 - Basic Info */}
            <div className="soft-card space-y-6 p-6 animate-in fade-in">
              <div>
                <label className="field-label">Project Name</label>
                <Input
                  name="name"
                  placeholder="My Awesome App"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="control-surface font-medium"
                />
                <p className="text-xs text-muted-foreground mt-1">Choose a memorable name for your project</p>
              </div>

              <div>
                <label className="field-label">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe what this project does..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-border dark:bg-input resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">Optional but helpful for team members</p>
              </div>

              <div>
                <label className="field-label">Environment</label>
                <select
                  name="enviroment"
                  value={formData.enviroment}
                  onChange={handleInputChange}
                  className="control-surface w-full px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>

              <div>
                <label className="field-label">Language / Framework</label>
                <select
                  name="languageOrFramework"
                  value={formData.languageOrFramework}
                  onChange={handleInputChange}
                  className="control-surface w-full px-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label className="field-label">Token API</label>
                <textarea
                  name="token"
                  placeholder="Enter your API token..."
                  value={formData.token}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-border dark:bg-input resize-none"
                  rows={4}
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-4 dark:border-border dark:bg-secondary/40">
                <div>
                  <label className="field-label">Custom Redaction Fields</label>
                  <p className="text-xs text-muted-foreground">
                    Default sensitive fields like password, token, authorization, cookies, API keys and card data are always redacted. Add only project-specific fields here.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={redactionField}
                    onChange={(event) => setRedactionField(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        addRedactionField()
                      }
                    }}
                    placeholder="customer_document"
                    className="control-surface font-medium"
                  />
                  <Button type="button" variant="outline" onClick={addRedactionField} className="gap-2 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm hover:border-primary/50 dark:bg-secondary/70">
                    <Plus size={16} />
                    Add
                  </Button>
                </div>

                {formData.redactionFields.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.redactionFields.map((field) => (
                      <Badge key={field} variant="outline" className="gap-1 py-1">
                        {field}
                        <button
                          type="button"
                          onClick={() => removeRedactionField(field)}
                          className="ml-1 rounded-sm text-muted-foreground hover:text-foreground"
                          aria-label={`Remove ${field}`}
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={() => handleCreateProject()} className="cursor-pointer w-full rounded-xl bg-primary font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 h-12">
                {params.get('id') ? 'Update Project' : 'Save Project'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
