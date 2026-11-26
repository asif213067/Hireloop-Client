"use client"

import {
  inputClass,
  labelClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import type { ProfessionalLinks } from "@/components/dashboard/seeker/settings/types"
import { Input } from "@/components/ui/input"

type ProfessionalLinksTabProps = {
  links: ProfessionalLinks
  onChange: (nextLinks: ProfessionalLinks) => void
}

export function ProfessionalLinksTab({
  links,
  onChange,
}: ProfessionalLinksTabProps) {
  function updateField(key: keyof ProfessionalLinks, value: string) {
    onChange({ ...links, [key]: value })
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="seeker-portfolio" className={labelClass}>
          Portfolio URL
        </label>
        <Input
          id="seeker-portfolio"
          type="url"
          value={links.portfolioUrl}
          onChange={(e) => updateField("portfolioUrl", e.target.value)}
          placeholder="https://yourportfolio.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="seeker-linkedin" className={labelClass}>
          LinkedIn URL
        </label>
        <Input
          id="seeker-linkedin"
          type="url"
          value={links.linkedinUrl}
          onChange={(e) => updateField("linkedinUrl", e.target.value)}
          placeholder="https://linkedin.com/in/username"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="seeker-github" className={labelClass}>
          GitHub URL
        </label>
        <Input
          id="seeker-github"
          type="url"
          value={links.githubUrl}
          onChange={(e) => updateField("githubUrl", e.target.value)}
          placeholder="https://github.com/username"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="seeker-other-url" className={labelClass}>
          Other Professional URL
        </label>
        <Input
          id="seeker-other-url"
          type="url"
          value={links.otherUrl}
          onChange={(e) => updateField("otherUrl", e.target.value)}
          placeholder="https://dribbble.com/username"
          className={inputClass}
        />
      </div>
    </div>
  )
}
