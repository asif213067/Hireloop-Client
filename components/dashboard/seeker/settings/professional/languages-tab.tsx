"use client"

import { useState } from "react"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  inputClass,
  labelClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import type {
  LanguageEntry,
  LanguageProficiency,
} from "@/components/dashboard/seeker/settings/types"
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

type LanguagesTabProps = {
  languages: LanguageEntry[]
  saving: boolean
  onPersistList: (
    nextList: LanguageEntry[],
    successMessage: string
  ) => Promise<boolean>
}

const PROFICIENCY_LEVELS: LanguageProficiency[] = [
  "Native",
  "Intermediate",
  "Professional",
]

const emptyForm: Omit<LanguageEntry, "id"> = {
  name: "",
  proficiency: "Professional",
}

export function LanguagesTab({
  languages,
  saving,
  onPersistList,
}: LanguagesTabProps) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<LanguageEntry, "id">>(emptyForm)

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(entry: LanguageEntry) {
    setEditingId(entry.id)
    setForm({
      name: entry.name,
      proficiency: entry.proficiency,
    })
    setOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = form.name.trim()
    if (!trimmedName) {
      toast.error("Please enter a language name.")
      return
    }

    const duplicate = languages.some(
      (item) =>
        item.id !== editingId &&
        item.name.toLowerCase() === trimmedName.toLowerCase()
    )
    if (duplicate) {
      toast.error("This language is already listed.")
      return
    }

    const cleaned: Omit<LanguageEntry, "id"> = {
      name: trimmedName,
      proficiency: form.proficiency,
    }

    const nextList = editingId
      ? languages.map((item) =>
          item.id === editingId ? { ...cleaned, id: editingId } : item
        )
      : [...languages, { ...cleaned, id: `lang-${Date.now()}` }]

    const ok = await onPersistList(
      nextList,
      editingId ? "Language updated" : "Language added"
    )
    if (ok) setOpen(false)
  }

  async function handleRemove(id: string) {
    await onPersistList(
      languages.filter((item) => item.id !== id),
      "Language removed"
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Add spoken or written languages and your proficiency level.
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
          Add Language
        </Button>
      </div>

      {languages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          No languages added yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs"
            >
              <span className="font-medium text-foreground">
                {lang.name} —{" "}
                <span className="text-muted-foreground">
                  {lang.proficiency}
                </span>
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => openEdit(lang)}
                  aria-label={`Edit ${lang.name}`}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  <PencilIcon className="size-3" />
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleRemove(lang.id)}
                  aria-label={`Remove ${lang.name}`}
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                >
                  <Trash2Icon className="size-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Language" : "Add Language"}
            </DialogTitle>
            <DialogDescription>
              Specify the language and your proficiency level.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3.5">
            <div>
              <label htmlFor="lang-name" className={labelClass}>
                Language
              </label>
              <Input
                id="lang-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Bangla, English, Hindi"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="lang-proficiency" className={labelClass}>
                Proficiency Level
              </label>
              <select
                id="lang-proficiency"
                value={form.proficiency}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    proficiency: e.target.value as LanguageProficiency,
                  }))
                }
                className={inputClass}
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
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
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Language"
                    : "Add Language"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
