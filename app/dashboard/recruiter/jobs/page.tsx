import { PlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { JobsList } from "@/components/dashboard/recruiter/jobs-list"
import { buttonVariants } from "@/components/ui/button"
import { requireRole } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Manage jobs",
  robots: { index: false, follow: false },
}

// Recruiter-only page listing every job the recruiter has posted
export default async function ManageJobsPage() {
  await requireRole("recruiter")

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            Manage Jobs <span aria-hidden className="px-1">›</span>
            <span className="text-primary">Job Listings &amp; Postings</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Manage Job Posts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review live listings, monitor applicants, and update job details across
            your organization.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto sm:shrink-0"
          )}
        >
          New Job Post
          <PlusIcon aria-hidden className="size-4" />
        </Link>
      </div>
      <JobsList />
    </div>
  )
}
