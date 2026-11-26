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

export type LanguageProficiency = "Native" | "Intermediate" | "Professional"

export type LanguageEntry = {
  id: string
  name: string
  proficiency: LanguageProficiency
}

export type ProfessionalLinks = {
  portfolioUrl: string
  linkedinUrl: string
  githubUrl: string
  otherUrl: string
}

export type ProfessionalProfile = {
  headline: string
  bio: string
  skills: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  languages: LanguageEntry[]
  links: ProfessionalLinks
}
