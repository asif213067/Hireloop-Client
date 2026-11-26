import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { ProfileAbout } from "@/components/profile/profile-about"
import { ProfileEducation } from "@/components/profile/profile-education"
import { ProfileExperience } from "@/components/profile/profile-experience"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileLinks } from "@/components/profile/profile-links"
import { ProfileProjects } from "@/components/profile/profile-projects"
import { ProfileResume } from "@/components/profile/profile-resume"
import { ProfileSkills } from "@/components/profile/profile-skills"
import { fetchPublicSeekerProfile } from "@/lib/public-profiles"

type Params = Promise<{ id: string }>
type SearchParams = Promise<{ from?: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { id } = await params
  const result = await fetchPublicSeekerProfile(id)

  if (result === null) return { title: "Profile unavailable" }
  if (result === "not-found") return { title: "Profile not found" }

  return {
    title: result.headline
      ? `${result.name} — ${result.headline}`
      : `${result.name} — Candidate Profile`,
    description: result.bio
      ? result.bio.slice(0, 150)
      : `View ${result.name}'s professional profile on HireLoop.`,
  }
}

export default async function PublicSeekerProfilePage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { id } = await params
  const { from } = await searchParams
  const profile = await fetchPublicSeekerProfile(id)

  if (profile === "not-found") notFound()

  const backHref =
    from === "recruiter-applications"
      ? "/dashboard/recruiter/applications"
      : "/jobs"
  const backLabel =
    from === "recruiter-applications"
      ? "Back to Applications"
      : "Browse Jobs"

  if (profile === null) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
          <span>{backLabel}</span>
        </Link>
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <p className="text-sm font-medium text-foreground">
            Could not load this candidate profile right now.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:py-12">
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon aria-hidden className="size-4" />
          <span>{backLabel}</span>
        </Link>
      </div>

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileAbout bio={profile.bio} />
          <ProfileExperience experience={profile.experience} />
          <ProfileEducation education={profile.education} />
          <ProfileProjects projects={profile.projects} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20">
          <ProfileSkills skills={profile.skills} />
          <ProfileLinks links={profile.links} />
          <ProfileResume resume={profile.resume} variant="card" />
        </aside>
      </div>
    </div>
  )
}
