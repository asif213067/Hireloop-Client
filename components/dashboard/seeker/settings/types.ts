export type ExperienceEntry = {
  id: string
  jobTitle: string
  company: string
  employmentType: string
  location: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  description: string
}

export type EducationEntry = {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  description: string
}

export type ProjectEntry = {
  id: string
  name: string
  description: string
  technologies: string[]
  url: string
}

export const PREVIEW_SKILLS = ["React", "TypeScript", "Next.js"]

export const PREVIEW_EXPERIENCE: ExperienceEntry[] = [
  {
    id: "exp-preview-1",
    jobTitle: "Senior Frontend Engineer",
    company: "Northstar Labs",
    employmentType: "Full-time",
    location: "San Francisco, CA (Remote)",
    startDate: "2023-03",
    endDate: "",
    currentlyWorking: true,
    description:
      "Lead frontend architecture for core web applications, design systems, and accessibility initiatives.",
  },
]

export const PREVIEW_EDUCATION: EducationEntry[] = [
  {
    id: "edu-preview-1",
    institution: "State University of Technology",
    degree: "B.Sc.",
    fieldOfStudy: "Computer Science",
    startDate: "2017-09",
    endDate: "2021-05",
    description:
      "Focused on software engineering, distributed systems, and human-computer interaction.",
  },
]

export const PREVIEW_PROJECTS: ProjectEntry[] = [
  {
    id: "proj-preview-1",
    name: "Design System Kit",
    description:
      "Accessible dark-mode React component library with keyboard navigation and responsive primitives.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    url: "https://github.com/example/design-system-kit",
  },
]
