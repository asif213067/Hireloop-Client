"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  inputClass,
  labelClass,
  textareaClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import type { ExperienceEntry } from "@/components/dashboard/seeker/settings/types"
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

type ExperienceTabProps = {
  experiences: ExperienceEntry[]
  saving: boolean
  onPersistList: (
    nextList: ExperienceEntry[],
    successMessage: string
  ) => Promise<boolean>
}

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
]

const emptyForm: Omit<ExperienceEntry, "id"> = {
  jobTitle: "",
  company: "",
  employmentType: "Full-time",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
}

export function ExperienceTab({
  experiences,
  saving,
  onPersistList,
}: ExperienceTabProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ExperienceEntry, "id">>(emptyForm)

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(entry: ExperienceEntry) {
    setEditingId(entry.id)
    setForm({
      jobTitle: entry.jobTitle,
      company: entry.company,
      employmentType: entry.employmentType,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      currentlyWorking: entry.currentlyWorking,
      description: entry.description,
    })
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.jobTitle.trim() || !form.company.trim()) {
      toast.error("Please enter both job title and company.")
      return
    }

    const cleaned: Omit<ExperienceEntry, "id"> = {
      ...form,
      jobTitle: form.jobTitle.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
    }

    const nextList = editingId
      ? experiences.map((item) =>
          item.id === editingId ? { ...cleaned, id: editingId } : item
        )
      : [{ ...cleaned, id: `exp-${Date.now()}` }, ...experiences]

    const ok = await onPersistList(
      nextList,
      editingId ? "Experience updated" : "Experience added"
    )
    if (ok) setOpen(false)
  }

  async function handleRemove(id: string) {
    await onPersistList(
      experiences.filter((item) => item.id !== id),
      "Experience removed"
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Add, edit, or remove your work history.
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
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No experience entries added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-lg border border-border bg-background/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {exp.jobTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {exp.company} · {exp.employmentType}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {exp.startDate || "Start"} —{" "}
                    {exp.currentlyWorking ? "Present" : exp.endDate || "End"}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={saving}
                    onClick={() => openEdit(exp)}
                    aria-label="Edit experience"
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={saving}
                    onClick={() => handleRemove(exp.id)}
                    aria-label="Remove experience"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </div>
              {exp.description && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              Save work history details to your seeker profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Job Title</label>
                <Input
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, jobTitle: e.target.value }))
                  }
                  placeholder="Software Engineer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company</label>
                <Input
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                  placeholder="Acme Inc."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Employment Type</label>
                <select
                  value={form.employmentType}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, employmentType: e.target.value }))
                  }
                  className={inputClass}
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="New York, NY / Remote"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Start Date</label>
                <Input
                  type="month"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <Input
                  type="month"
                  disabled={form.currentlyWorking}
                  value={form.currentlyWorking ? "" : form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-foreground">
              <input
                type="checkbox"
                checked={form.currentlyWorking}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    currentlyWorking: e.target.checked,
                    endDate: e.target.checked ? "" : f.endDate,
                  }))
                }
                className="size-4 rounded border-border"
              />
              I am currently working in this role
            </label>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Key responsibilities and achievements..."
                className={textareaClass}
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
