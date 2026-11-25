"use client"

import { useState } from "react"
import {
  BriefcaseIcon,
  ExternalLinkIcon,
  FolderGit2Icon,
  GraduationCapIcon,
  LinkIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  PREVIEW_EDUCATION,
  PREVIEW_EXPERIENCE,
  PREVIEW_PROJECTS,
  PREVIEW_SKILLS,
  type EducationEntry,
  type ExperienceEntry,
  type ProjectEntry,
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
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type SubTab = "experience" | "education" | "projects" | "links"

const labelClass = "mb-1.5 block text-sm font-medium text-foreground"
const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground"
const textareaClass =
  "min-h-24 w-full rounded-lg border border-border bg-background/60 p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
]

export function ProfessionalDetailsSection() {
  const [headline, setHeadline] = useState("")
  const [bio, setBio] = useState("")
  const [skills, setSkills] = useState<string[]>(PREVIEW_SKILLS)
  const [skillInput, setSkillInput] = useState("")

  const [activeTab, setActiveTab] = useState<SubTab>("experience")

  const [experiences, setExperiences] =
    useState<ExperienceEntry[]>(PREVIEW_EXPERIENCE)
  const [educations, setEducations] =
    useState<EducationEntry[]>(PREVIEW_EDUCATION)
  const [projects, setProjects] = useState<ProjectEntry[]>(PREVIEW_PROJECTS)

  // Professional Links
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [otherUrl, setOtherUrl] = useState("")

  // Experience Modal State
  const [expOpen, setExpOpen] = useState(false)
  const [expEditingId, setExpEditingId] = useState<string | null>(null)
  const [expForm, setExpForm] = useState<Omit<ExperienceEntry, "id">>({
    jobTitle: "",
    company: "",
    employmentType: "Full-time",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  })

  // Education Modal State
  const [eduOpen, setEduOpen] = useState(false)
  const [eduEditingId, setEduEditingId] = useState<string | null>(null)
  const [eduForm, setEduForm] = useState<Omit<EducationEntry, "id">>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    description: "",
  })

  // Project Modal State
  const [projOpen, setProjOpen] = useState(false)
  const [projEditingId, setProjEditingId] = useState<string | null>(null)
  const [projForm, setProjForm] = useState({
    name: "",
    description: "",
    technologiesText: "",
    url: "",
  })

  // Skills handlers
  function addSkill(raw: string) {
    const trimmed = raw.trim()
    if (!trimmed) return
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput("")
      return
    }
    setSkills((prev) => [...prev, trimmed])
    setSkillInput("")
  }

  function handleSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  function removeSkill(target: string) {
    setSkills((prev) => prev.filter((s) => s !== target))
  }

  // Experience CRUD (UI preview state only)
  function openNewExperience() {
    setExpEditingId(null)
    setExpForm({
      jobTitle: "",
      company: "",
      employmentType: "Full-time",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    })
    setExpOpen(true)
  }

  function openEditExperience(entry: ExperienceEntry) {
    setExpEditingId(entry.id)
    setExpForm({
      jobTitle: entry.jobTitle,
      company: entry.company,
      employmentType: entry.employmentType,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      currentlyWorking: entry.currentlyWorking,
      description: entry.description,
    })
    setExpOpen(true)
  }

  function saveExperienceDialog(e: React.FormEvent) {
    e.preventDefault()
    if (!expForm.jobTitle.trim() || !expForm.company.trim()) {
      toast.error("Please enter both job title and company.")
      return
    }
    if (expEditingId) {
      setExperiences((prev) =>
        prev.map((item) =>
          item.id === expEditingId ? { ...expForm, id: expEditingId } : item
        )
      )
    } else {
      setExperiences((prev) => [
        { ...expForm, id: `exp-${Date.now()}` },
        ...prev,
      ])
    }
    setExpOpen(false)
    toast.info("Experience entry updated in preview. Saving will be available soon.")
  }

  // Education CRUD (UI preview state only)
  function openNewEducation() {
    setEduEditingId(null)
    setEduForm({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    })
    setEduOpen(true)
  }

  function openEditEducation(entry: EducationEntry) {
    setEduEditingId(entry.id)
    setEduForm({
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      startDate: entry.startDate,
      endDate: entry.endDate,
      description: entry.description,
    })
    setEduOpen(true)
  }

  function saveEducationDialog(e: React.FormEvent) {
    e.preventDefault()
    if (!eduForm.institution.trim() || !eduForm.degree.trim()) {
      toast.error("Please enter both institution and degree.")
      return
    }
    if (eduEditingId) {
      setEducations((prev) =>
        prev.map((item) =>
          item.id === eduEditingId ? { ...eduForm, id: eduEditingId } : item
        )
      )
    } else {
      setEducations((prev) => [
        { ...eduForm, id: `edu-${Date.now()}` },
        ...prev,
      ])
    }
    setEduOpen(false)
    toast.info("Education entry updated in preview. Saving will be available soon.")
  }

  // Project CRUD (UI preview state only)
  function openNewProject() {
    setProjEditingId(null)
    setProjForm({
      name: "",
      description: "",
      technologiesText: "",
      url: "",
    })
    setProjOpen(true)
  }

  function openEditProject(entry: ProjectEntry) {
    setProjEditingId(entry.id)
    setProjForm({
      name: entry.name,
      description: entry.description,
      technologiesText: entry.technologies.join(", "),
      url: entry.url,
    })
    setProjOpen(true)
  }

  function saveProjectDialog(e: React.FormEvent) {
    e.preventDefault()
    if (!projForm.name.trim()) {
      toast.error("Please enter a project name.")
      return
    }
    const technologies = projForm.technologiesText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const payload: Omit<ProjectEntry, "id"> = {
      name: projForm.name.trim(),
      description: projForm.description.trim(),
      technologies,
      url: projForm.url.trim(),
    }

    if (projEditingId) {
      setProjects((prev) =>
        prev.map((item) =>
          item.id === projEditingId ? { ...payload, id: projEditingId } : item
        )
      )
    } else {
      setProjects((prev) => [
        { ...payload, id: `proj-${Date.now()}` },
        ...prev,
      ])
    }
    setProjOpen(false)
    toast.info("Project entry updated in preview. Saving will be available soon.")
  }

  function handleSaveDetails(e: React.FormEvent) {
    e.preventDefault()
    toast.info("Saving professional details is coming soon.")
  }

  const tabs: { id: SubTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: "experience",
      label: "Experience",
      icon: <BriefcaseIcon aria-hidden className="size-3.5" />,
      count: experiences.length,
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCapIcon aria-hidden className="size-3.5" />,
      count: educations.length,
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderGit2Icon aria-hidden className="size-3.5" />,
      count: projects.length,
    },
    {
      id: "links",
      label: "Links",
      icon: <LinkIcon aria-hidden className="size-3.5" />,
    },
  ]

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Professional Details
      </h2>

      <form onSubmit={handleSaveDetails} className="mt-5 space-y-5">
        {/* Headline */}
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

        {/* Bio / About Me */}
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

        {/* Skills Chips Input */}
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
              onKeyDown={handleSkillKeyDown}
              placeholder="Add a skill and press Enter..."
              className="min-w-36 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        <Separator />

        {/* Organized Subsections Navigation */}
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
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      active ? "bg-black/20 text-white" : "bg-secondary text-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Experience Subsection */}
        {activeTab === "experience" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Preview entries shown below. Add, edit, or remove work history.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openNewExperience}
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
                          onClick={() => openEditExperience(exp)}
                          aria-label="Edit experience"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setExperiences((prev) =>
                              prev.filter((item) => item.id !== exp.id)
                            )
                          }
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
          </div>
        )}

        {/* Education Subsection */}
        {activeTab === "education" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Academic degrees, certifications, and fields of study.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openNewEducation}
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
                          onClick={() => openEditEducation(edu)}
                          aria-label="Edit education"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setEducations((prev) =>
                              prev.filter((item) => item.id !== edu.id)
                            )
                          }
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
          </div>
        )}

        {/* Projects Subsection */}
        {activeTab === "projects" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Highlight notable projects, open-source work, or case studies.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openNewProject}
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
                          onClick={() => openEditProject(proj)}
                          aria-label="Edit project"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setProjects((prev) =>
                              prev.filter((item) => item.id !== proj.id)
                            )
                          }
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
          </div>
        )}

        {/* Links Subsection */}
        {activeTab === "links" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="seeker-portfolio" className={labelClass}>
                Portfolio URL
              </label>
              <Input
                id="seeker-portfolio"
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
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
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
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
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
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
                value={otherUrl}
                onChange={(e) => setOtherUrl(e.target.value)}
                placeholder="https://dribbble.com/username"
                className={inputClass}
              />
            </div>
          </div>
        )}

        <Separator />

        <div>
          <Button
            type="submit"
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"
          >
            Save Details
          </Button>
        </div>
      </form>

      {/* Experience Add/Edit Dialog */}
      <Dialog open={expOpen} onOpenChange={setExpOpen}>
        <DialogContent className="border border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {expEditingId ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              Add work history details to preview on your seeker profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveExperienceDialog} className="space-y-3.5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Job Title</label>
                <Input
                  value={expForm.jobTitle}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, jobTitle: e.target.value }))
                  }
                  placeholder="Software Engineer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company</label>
                <Input
                  value={expForm.company}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, company: e.target.value }))
                  }
                  placeholder="Acme Inc."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Employment Type</label>
                <select
                  value={expForm.employmentType}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, employmentType: e.target.value }))
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
                  value={expForm.location}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="New York, NY / Remote"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Start Date</label>
                <Input
                  type="month"
                  value={expForm.startDate}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <Input
                  type="month"
                  disabled={expForm.currentlyWorking}
                  value={expForm.currentlyWorking ? "" : expForm.endDate}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-foreground">
              <input
                type="checkbox"
                checked={expForm.currentlyWorking}
                onChange={(e) =>
                  setExpForm((f) => ({
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
                value={expForm.description}
                onChange={(e) =>
                  setExpForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Key responsibilities and achievements..."
                className={textareaClass}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setExpOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white font-semibold text-black hover:bg-white/90"
              >
                {expEditingId ? "Update Entry" : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Education Add/Edit Dialog */}
      <Dialog open={eduOpen} onOpenChange={setEduOpen}>
        <DialogContent className="border border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {eduEditingId ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              Add your academic background to preview on your profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveEducationDialog} className="space-y-3.5">
            <div>
              <label className={labelClass}>Institution</label>
              <Input
                value={eduForm.institution}
                onChange={(e) =>
                  setEduForm((f) => ({ ...f, institution: e.target.value }))
                }
                placeholder="University Name"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Degree</label>
                <Input
                  value={eduForm.degree}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, degree: e.target.value }))
                  }
                  placeholder="B.Sc. / M.Sc."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Field of Study</label>
                <Input
                  value={eduForm.fieldOfStudy}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, fieldOfStudy: e.target.value }))
                  }
                  placeholder="Computer Science"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Start Date</label>
                <Input
                  type="month"
                  value={eduForm.startDate}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>End Date</label>
                <Input
                  type="month"
                  value={eduForm.endDate}
                  onChange={(e) =>
                    setEduForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={eduForm.description}
                onChange={(e) =>
                  setEduForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Coursework, honors, or activities..."
                className={textareaClass}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEduOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white font-semibold text-black hover:bg-white/90"
              >
                {eduEditingId ? "Update Entry" : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Project Add/Edit Dialog */}
      <Dialog open={projOpen} onOpenChange={setProjOpen}>
        <DialogContent className="border border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {projEditingId ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription>
              Showcase a project you built or contributed to.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveProjectDialog} className="space-y-3.5">
            <div>
              <label className={labelClass}>Project Name</label>
              <Input
                value={projForm.name}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Portfolio Platform"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={projForm.description}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="What it does and your role..."
                className={textareaClass}
              />
            </div>

            <div>
              <label className={labelClass}>Technologies Used</label>
              <Input
                value={projForm.technologiesText}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, technologiesText: e.target.value }))
                }
                placeholder="React, TypeScript, Node.js (comma separated)"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Project URL</label>
              <Input
                type="url"
                value={projForm.url}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, url: e.target.value }))
                }
                placeholder="https://github.com/username/project"
                className={inputClass}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setProjOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white font-semibold text-black hover:bg-white/90"
              >
                {projEditingId ? "Update Entry" : "Add Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
