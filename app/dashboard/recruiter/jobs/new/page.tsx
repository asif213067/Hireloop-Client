import type { Metadata } from "next"
import Link from "next/link"

import { JobForm, PublishJobButton } from "@/components/dashboard/recruiter/job-form"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Post a new job",
  robots: { index: false, follow: false },
}

// Recruiter-only page; the shell provides the content padding
export default async function NewJobPage() {
  await requireRole("recruiter")

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link
              href="/dashboard/recruiter/jobs"
              className="outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Manage Jobs
            </Link>
            <span aria-hidden className="px-1">›</span>
            <span className="text-muted-foreground">Create New Listing</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Post a New Job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Fill in the position specifications to attract qualified talent across our network.
          </p>
        </div>
        <PublishJobButton className="hidden shrink-0 sm:inline-flex" />
      </div>
      <JobForm />
    </div>
  )
}
