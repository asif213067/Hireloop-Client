import type { Metadata } from "next"

import {
  JobForm,
  PublishJobButton,
} from "@/components/dashboard/recruiter/job-form"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Edit job",
  robots: { index: false, follow: false },
}

// Recruiter-only page editing one job listing
export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole("recruiter")

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            Manage Jobs <span aria-hidden className="px-1">›</span>
            <span className="text-muted-foreground">Edit Job Listing</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Edit Job Post
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update the position details and save your changes.
          </p>
        </div>
        <PublishJobButton label="Save Changes" busyLabel="Saving..." className="hidden shrink-0 sm:inline-flex" />
      </div>
      <JobForm jobId={id} />
    </div>
  )
}
