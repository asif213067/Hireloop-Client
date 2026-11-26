"use client"

import { useState } from "react"
import { XIcon } from "lucide-react"
import { toast } from "sonner"

import { labelClass } from "@/components/dashboard/seeker/settings/form-styles"

type SkillsInputProps = {
  skills: string[]
  onChange: (nextSkills: string[]) => void
}

export function SkillsInput({ skills, onChange }: SkillsInputProps) {
  const [skillInput, setSkillInput] = useState("")

  function addSkill(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput("")
      return
    }
    if (skills.length >= 50) {
      toast.error("You can add up to 50 skills.")
      return
    }
    onChange([...skills, trimmed])
    setSkillInput("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  function removeSkill(target: string) {
    onChange(skills.filter((s) => s !== target))
  }

  return (
    <div>
      <label htmlFor="seeker-skills" className={labelClass}>
        Skills
      </label>
      <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/70 px-2.5 py-1 text-xs font-medium text-foreground"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              aria-label={`Remove ${skill}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <XIcon className="size-3" />
            </button>
          </span>
        ))}
        <input
          id="seeker-skills"
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill and press Enter..."
          className="min-w-36 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>
    </div>
  )
}
