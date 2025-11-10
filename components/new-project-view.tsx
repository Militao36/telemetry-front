"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check } from "lucide-react"

export function NewProjectView() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    environment: "production",
    language: "nodejs",
  })

  const [step, setStep] = useState(1)
  const [createdProject, setCreatedProject] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateProject = () => {
    if (formData.name.trim()) {
      setCreatedProject(true)
      setTimeout(() => {
        window.location.href = "/projects"
      }, 2000)
    }
  }

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
        {createdProject ? (
          // Success State
          <div className="flex items-center justify-center min-h-full p-4">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <Check size={40} className="text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Project Created!</h2>
              <p className="text-muted-foreground mb-6">"{formData.name}" is ready to monitor</p>
              <p className="text-sm text-muted-foreground">Redirecting to projects...</p>
            </div>
          </div>
        ) : (
          // Form State
          <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
              <p className="text-muted-foreground">Set up a new project to start monitoring your application logs</p>
            </div>

            {/* Form */}
            <div className="space-y-8">
              {/* Step 1 - Basic Info */}
              {step === 1 && (
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
                      name="environment"
                      value={formData.environment}
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

                  <Button onClick={() => setStep(2)} className="w-full bg-primary hover:bg-primary/90 h-11">
                    Next
                  </Button>
                </div>
              )}

              {/* Step 2 - Integration Setup */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Integration Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                        <div className="ml-3">
                          <p className="font-medium">Slack Notifications</p>
                          <p className="text-xs text-muted-foreground">Get alerts in Slack</p>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-primary" />
                        <div className="ml-3">
                          <p className="font-medium">Email Alerts</p>
                          <p className="text-xs text-muted-foreground">Receive email notifications</p>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-primary" />
                        <div className="ml-3">
                          <p className="font-medium">PagerDuty</p>
                          <p className="text-xs text-muted-foreground">Integrate with PagerDuty</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Monitoring Preferences</h3>
                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors mb-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                      <div className="ml-3">
                        <p className="font-medium">Error Tracking</p>
                        <p className="text-xs text-muted-foreground">Monitor application errors</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors mb-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                      <div className="ml-3">
                        <p className="font-medium">Performance Metrics</p>
                        <p className="text-xs text-muted-foreground">Track response times and queries</p>
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-background/50 transition-colors">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
                      <div className="ml-3">
                        <p className="font-medium">Log Aggregation</p>
                        <p className="text-xs text-muted-foreground">Collect and analyze logs</p>
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1 bg-primary hover:bg-primary/90">
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3 - Review & Create */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-lg">Review Project Details</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Project Name</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Environment</span>
                        <span className="font-semibold capitalize">{formData.environment}</span>
                      </div>

                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Language</span>
                        <span className="font-semibold capitalize">{formData.language}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Description</span>
                        <span className="font-semibold text-right max-w-xs">
                          {formData.description || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-200">
                      After creation, you'll receive an API key to integrate with your application.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                      disabled={!formData.name.trim()}
                      className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      Create Project
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
