"use client"

import { useEffect, useState } from "react"

import { JobCard } from "@/components/jobs/job-card"
import { authClient } from "@/lib/auth-client"
import { isRole, type Role } from "@/lib/roles"
import { fetchSavedJobIds } from "@/lib/saved-jobs-api"
import type { PublicJob } from "@/lib/jobs"

// Card list for the Browse page; loads the seeker's saved ids once
export function JobCards({ jobs }: { jobs: PublicJob[] }) {
  const { data: session, isPending } = authClient.useSession()
  const [savedIds, setSavedIds] = useState<string[] | null>(null)

  // No role in the user row counts as a plain seeker
  const role: Role | null = session
    ? isRole(session.user.role)
      ? session.user.role
      : "seeker"
    : null
  const isSeeker = role === "seeker"

  // One ids request for the whole list, seekers only
  useEffect(() => {
    if (isPending || !session || !isSeeker) return
    let cancelled = false
    fetchSavedJobIds().then((ids) => {
      if (cancelled) return
      // null on failure: every card simply starts unsaved
      setSavedIds(ids ?? [])
    })
    return () => {
      cancelled = true
    }
  }, [session, isPending, isSeeker])

  return (
    <ul className="mt-4 grid gap-4">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard
            job={job}
            initialSaved={savedIds?.includes(job.id) ?? false}
          />
        </li>
      ))}
    </ul>
  )
}
