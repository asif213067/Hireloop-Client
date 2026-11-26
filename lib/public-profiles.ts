import type {
  EducationEntry,
  ExperienceEntry,
  ProfessionalLinks,
  ProjectEntry,
} from "@/components/dashboard/seeker/settings/types"

export type PublicSeekerResume = {
  url: string
  fileName: string
}

export type PublicSeekerProfile = {
  id: string
  name: string
  image: string | null
  city: string
  country: string
  headline: string
  bio: string
  skills: string[]
  experience: ExperienceEntry[]
  education: EducationEntry[]
  projects: ProjectEntry[]
  links: ProfessionalLinks
  resume: PublicSeekerResume | null
}

const rawBase = process.env.NEXT_PUBLIC_SERVER_BASE_URL
const API_BASE =
  typeof rawBase === "string" ? rawBase.trim().replace(/\/+$/, "") : ""

export async function fetchPublicSeekerProfile(
  id: string
): Promise<PublicSeekerProfile | "not-found" | null> {
  if (!API_BASE || !id) return null

  try {
    const res = await fetch(
      `${API_BASE}/api/public/profiles/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    )

    if (res.status === 404) return "not-found"
    if (!res.ok) return null

    const data = (await res.json().catch(() => null)) as {
      profile?: PublicSeekerProfile
    } | null

    return data?.profile ?? null
  } catch {
    return null
  }
}
