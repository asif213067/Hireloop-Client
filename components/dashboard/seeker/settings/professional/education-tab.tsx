"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  inputClass,
  labelClass,
  textareaClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import type { EducationEntry } from "@/components/dashboard/seeker/settings/types"
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

type EducationTabProps = {
  educations: EducationEntry[]
  saving: boolean
  onPersistList: (
    nextList: EducationEntry[],
    successMessage: string
  ) => Promise<boolean>
}

const emptyForm: Omit<EducationEntry, "id"> = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  description: "",
}

export function EducationTab({
  educations,
  saving,
  onPersistList,
}: EducationTabProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<EducationEntry, "id">>(emptyForm)

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(entry: EducationEntry) {
    setEditingId(entry.id)
    setForm({
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      startDate: entry.startDate,
      endDate: entry.endDate,
      description: entry.description,
    })
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.institution.trim() || !form.degree.trim()) {
      toast.error("Please enter both institution and degree.")
      return
    }

    const cleaned: Omit<EducationEntry, "id"> = {
      ...form,
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      fieldOfStudy: form.fieldOfStudy.trim(),
      description: form.description.trim(),
    }

    const nextList = editingId
      ? educations.map((item) =>
          item.id === editingId ? { ...cleaned, id: editingId } : item
        )
      : [{ ...cleaned, id: `edu-${Date.now()}` }, ...educations]

    const ok = await onPersistList(
      nextList,
      editingId ? "Education updated" : "Education added"
    )
    if (ok) setOpen(false)
  }

  async function handleRemove(id: string) {
    await onPersistList(
      educations.filter((item) => item.id !== id),
      "Education removed"
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Academic degrees, certifications, and fields of study.
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
          Add Education
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No education entries added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="rounded-lg border border-border bg-background/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {edu.institution}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {edu.degree}
                    {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {edu.startDate || "Start"} — {edu.endDate || "End"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={saving}
                    onClick={() => openEdit(edu)}
                    aria-label="Edit education"
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={saving}
                    onClick={() => handleRemove(edu.id)}
                    aria-label="Remove education"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </div>
              {edu.description && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {edu.description}
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
              {editingId ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              Save your academic background to your seeker profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label className={labelClass}>Institution</label>
              <Input
                value={form.institution}
                onChange={(e) =>
                  setForm((f) => ({ ...f, institution: e.target.value }))
                }
                placeholder="University Name"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Degree</label>
                <Input
                  value={form.degree}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, degree: e.target.value }))
                  }
                  placeholder="B.Sc. / M.Sc."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Field of Study</label>
                <Input
                  value={form.fieldOfStudy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))
                  }
                  placeholder="Computer Science"
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
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Coursework, honors, or activities..."
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
