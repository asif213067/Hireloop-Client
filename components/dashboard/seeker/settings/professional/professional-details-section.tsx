"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  cardClass,
  inputClass,
  isValidOptionalUrl,
  labelClass,
  textareaClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import { EducationTab } from "@/components/dashboard/seeker/settings/professional/education-tab"
import { ExperienceTab } from "@/components/dashboard/seeker/settings/professional/experience-tab"
import { ProfessionalLinksTab } from "@/components/dashboard/seeker/settings/professional/professional-links-tab"
import { ProjectsTab } from "@/components/dashboard/seeker/settings/professional/projects-tab"
import { SkillsInput } from "@/components/dashboard/seeker/settings/professional/skills-input"
import type {
  EducationEntry,
  ExperienceEntry,
  ProfessionalLinks,
  ProfessionalProfile,
  ProjectEntry,
} from "@/components/dashboard/seeker/settings/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { saveProfessionalProfile } from "@/lib/profile-api"
import { cn } from "@/lib/utils"

type SubTab = "experience" | "education" | "projects" | "links"

type ProfessionalDetailsSectionProps = {
  initialProfile: ProfessionalProfile
  onSaved: (next: ProfessionalProfile) => void
}

export function ProfessionalDetailsSection({
  initialProfile,
  onSaved,
}: ProfessionalDetailsSectionProps) {
  const [headline, setHeadline] = useState(initialProfile.headline)
  const [bio, setBio] = useState(initialProfile.bio)
  const [skills, setSkills] = useState<string[]>(initialProfile.skills)
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(
    initialProfile.experience
  )
  const [educations, setEducations] = useState<EducationEntry[]>(
    initialProfile.education
  )
  const [projects, setProjects] = useState<ProjectEntry[]>(
    initialProfile.projects
  )
  const [links, setLinks] = useState<ProfessionalLinks>(initialProfile.links)

  const [activeTab, setActiveTab] = useState<SubTab>("experience")
  const [saving, setSaving] = useState(false)

  function buildPayload(
    overrides?: Partial<ProfessionalProfile>
  ): ProfessionalProfile {
    return {
      headline: headline.trim(),
      bio: bio.trim(),
      skills,
      experience: experiences,
      education: educations,
      projects,
      links: {
        portfolioUrl: links.portfolioUrl.trim(),
        linkedinUrl: links.linkedinUrl.trim(),
        githubUrl: links.githubUrl.trim(),
        otherUrl: links.otherUrl.trim(),
      },
      ...overrides,
    }
  }

  async function persistProfile(
    payload: ProfessionalProfile,
    successMessage: string
  ): Promise<boolean> {
    if (saving) return false

    if (
      !isValidOptionalUrl(payload.links.portfolioUrl) ||
      !isValidOptionalUrl(payload.links.linkedinUrl) ||
      !isValidOptionalUrl(payload.links.githubUrl) ||
      !isValidOptionalUrl(payload.links.otherUrl)
    ) {
      toast.error("Please enter valid http(s) URLs in the Links tab.")
      return false
    }

    setSaving(true)
    try {
      const result = await saveProfessionalProfile(payload)
      if (!result.ok || !result.professional) {
        toast.error(result.error || "Could not save professional details.")
        return false
      }
      onSaved(result.professional)
      toast.success(successMessage)
      return true
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveDetails() {
    await persistProfile(buildPayload(), "Professional details saved")
  }

  const tabs: {
    id: SubTab
    label: string
    count?: number
  }[] = [
    {
      id: "experience",
      label: "Experience",
      count: experiences.length,
    },
    {
      id: "education",
      label: "Education",
      count: educations.length,
    },
    {
      id: "projects",
      label: "Projects",
      count: projects.length,
    },
    {
      id: "links",
      label: "Links",
    },
  ]

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-semibold text-foreground">
        Professional Details
      </h2>

      <div className="mt-5 space-y-5">
        <div>
          <label htmlFor="seeker-headline" className={labelClass}>
            Professional Headline
          </label>
          <Input
            id="seeker-headline"
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Senior UX/UI Designer"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="seeker-bio" className={labelClass}>
            Bio / About Me
          </label>
          <textarea
            id="seeker-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Passionate designer with 5+ years of experience crafting user-centric digital experiences..."
            className={textareaClass}
          />
        </div>

        <SkillsInput skills={skills} onChange={setSkills} />

        <Separator />

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      active
                        ? "bg-black/20 text-white"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {activeTab === "experience" && (
          <ExperienceTab
            experiences={experiences}
            saving={saving}
            onPersistList={async (nextList, message) => {
              const ok = await persistProfile(
                buildPayload({ experience: nextList }),
                message
              )
              if (ok) setExperiences(nextList)
              return ok
            }}
          />
        )}

        {activeTab === "education" && (
          <EducationTab
            educations={educations}
            saving={saving}
            onPersistList={async (nextList, message) => {
              const ok = await persistProfile(
                buildPayload({ education: nextList }),
                message
              )
              if (ok) setEducations(nextList)
              return ok
            }}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            saving={saving}
            onPersistList={async (nextList, message) => {
              const ok = await persistProfile(
                buildPayload({ projects: nextList }),
                message
              )
              if (ok) setProjects(nextList)
              return ok
            }}
          />
        )}

        {activeTab === "links" && (
          <ProfessionalLinksTab links={links} onChange={setLinks} />
        )}

        <Separator />

        <div>
          <Button
            type="button"
            disabled={saving}
            onClick={handleSaveDetails}
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"
          >
            {saving ? "Saving..." : "Save Details"}
          </Button>
        </div>
      </div>
    </section>
  )
}
