"use client"

import { useState } from "react"
import {
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import {
  inputClass,
  isValidOptionalUrl,
  labelClass,
  textareaClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import type { ProjectEntry } from "@/components/dashboard/seeker/settings/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ProjectsTabProps = {
  projects: ProjectEntry[]
  saving: boolean
  onPersistList: (
    nextList: ProjectEntry[],
    successMessage: string
  ) => Promise<boolean>
}

const emptyForm = {
  name: "",
  description: "",
  technologiesText: "",
  url: "",
}

export function ProjectsTab({
  projects,
  saving,
  onPersistList,
}: ProjectsTabProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(entry: ProjectEntry) {
    setEditingId(entry.id)
    setForm({
      name: entry.name,
      description: entry.description,
      technologiesText: entry.technologies.join(", "),
      url: entry.url,
    })
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Please enter a project name.")
      return
    }
    if (!isValidOptionalUrl(form.url)) {
      toast.error("Please enter a valid http(s) project URL.")
      return
    }

    const technologies = form.technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const payloadEntry: Omit<ProjectEntry, "id"> = {
      name: form.name.trim(),
      description: form.description.trim(),
      technologies,
      url: form.url.trim(),
    }

    const nextList = editingId
      ? projects.map((item) =>
          item.id === editingId ? { ...payloadEntry, id: editingId } : item
        )
      : [{ ...payloadEntry, id: `proj-${Date.now()}` }, ...projects]

    const ok = await onPersistList(
      nextList,
      editingId ? "Project updated" : "Project added"
    )
    if (ok) setOpen(false)
  }

  async function handleRemove(id: string) {
    await onPersistList(
      projects.filter((item) => item.id !== id),
      "Project removed"
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Highlight notable projects, open-source work, or case studies.
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={saving}
          onClick={openNew}
          className="h-8 rounded-lg border-border bg-background/60 text-xs"
        >
          <PlusIcon aria-hidden className="mr-1 size-3.5" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No project entries added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-lg border border-border bg-background/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {proj.name}
                    </h3>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <span>Link</span>
                        <ExternalLinkIcon className="size-3" />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-secondary px-2 py-0.5 text-[11px] text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={saving}
                    onClick={() => openEdit(proj)}
                    aria-label="Edit project"
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={saving}
                    onClick={() => handleRemove(proj.id)}
                    aria-label="Remove project"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription>
              Showcase a project you built or contributed to.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className={labelClass}>Project Name</label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Portfolio Platform"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="What it does and your role..."
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>Technologies Used</label>
              <Input
                value={form.technologiesText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, technologiesText: e.target.value }))
                }
                placeholder="React, TypeScript, Node.js (comma separated)"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Project URL</label>
              <Input
                type="url"
                value={form.url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://github.com/username/project"
                className={inputClass}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-white font-semibold text-black hover:bg-white/90"
              >
                {saving ? "Saving..." : editingId ? "Update Entry" : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
