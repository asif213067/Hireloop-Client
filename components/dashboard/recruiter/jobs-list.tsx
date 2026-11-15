"use client"

import { BriefcaseIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { apiRequest } from "@/lib/api"
import {
  formatDate,
  formatCompensation,
  getJobStatus,
  getJobTypeLabel,
  isJobResponse,
  type JobResponse,
} from "@/lib/jobs"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LIST_PATH = "/dashboard/recruiter/jobs"

// Pill for Active/Expired with the deadline-based status
function StatusPill({ status }: { status: "active" | "expired" }) {
  return status === "active" ? (
    <span className="inline-flex items-center rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      Expired
    </span>
  )
}

// Pill for the job type value
function TypePill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
      {label}
    </span>
  )
}

// Location line: pin + text, or Remote when flagged without a location
function LocationLine({ job }: { job: JobResponse }) {
  if (job.isRemote && job.location === null) {
    return <span className="text-sm text-muted-foreground">Remote</span>
  }
  if (job.location === null) return null
  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <MapPinIcon aria-hidden className="size-3.5 shrink-0" />
      {job.location}
    </span>
  )
}

// Title tile + name + category used in the table row
function JobTitleCell({ job }: { job: JobResponse }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <BriefcaseIcon aria-hidden className="size-4 text-secondary-foreground" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {job.title}
        </span>
        <span className="block text-xs text-primary">{job.category}</span>
      </span>
    </div>
  )
}

// Update link and delete button, shared by the table and the cards
function RowActions({
  job,
  pending,
  onDelete,
}: {
  job: JobResponse
  pending: boolean
  onDelete: (job: JobResponse) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`${LIST_PATH}/${job.id}/edit`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        )}
      >
        <PencilIcon aria-hidden className="size-4" />
        Update
        <span className="sr-only">{job.title}</span>
      </Link>
      <button
        type="button"
        onClick={() => onDelete(job)}
        disabled={pending}
        aria-label={`Delete ${job.title}`}
        className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-destructive focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
      >
        <Trash2Icon aria-hidden className="size-4" />
        <span className="sr-only">Delete</span>
      </button>
    </div>
  )
}

// Shape check for the GET /api/jobs/mine payload
function isJobsPayload(data: unknown): data is { jobs: JobResponse[] } {
  return (
    typeof data === "object" &&
    data !== null &&
    "jobs" in data &&
    Array.isArray((data as { jobs: unknown }).jobs) &&
    (data as { jobs: unknown[] }).jobs.every(isJobResponse)
  )
}

// One list request, reused by the effect and the retry button
async function loadJobs(): Promise<{ jobs: JobResponse[] } | null> {
  const { status, data } = await apiRequest("/api/jobs/mine")
  return status === 200 && isJobsPayload(data) ? data : null
}

// Recruiter's own job posts with update and delete actions
export function JobsList() {
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  function applyJobs(result: { jobs: JobResponse[] } | null) {
    if (result === null) {
      setLoadState("error")
    } else {
      setJobs(result.jobs)
      setLoadState("ready")
    }
  }

  useEffect(() => {
    let cancelled = false
    void loadJobs().then((result) => {
      if (!cancelled) applyJobs(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  function retry() {
    setLoadState("loading")
    void loadJobs().then(applyJobs)
  }

  // Confirm, delete, then drop the row from the list
  async function handleDelete(job: JobResponse) {
    if (!window.confirm("Delete this job? This can't be undone.")) return
    setDeletingId(job.id)
    setDeleteError(null)
    const { status } = await apiRequest(`/api/jobs/${job.id}`, { method: "DELETE" })
    if (status === 204) {
      setJobs((current) => current.filter((item) => item.id !== job.id))
    } else {
      setDeleteError("Could not delete the job. Please try again.")
    }
    setDeletingId(null)
  }

  if (loadState === "loading") {
    return (
      <p role="status" className="mt-8 text-sm text-muted-foreground">
        Loading your job posts...
      </p>
    )
  }

  if (loadState === "error") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <p role="alert" className="text-sm text-destructive">
          Could not load your job posts. Please try again.
        </p>
        <button
          type="button"
          onClick={retry}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-4 inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          )}
        >
          Try again
        </button>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <p className="text-sm text-muted-foreground">
          You haven&apos;t posted any jobs yet.
        </p>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          )}
        >
          Post your first job
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {deleteError ? (
        <p
          role="alert"
          className="mb-4 text-sm text-destructive"
        >
          {deleteError}
        </p>
      ) : null}

      {/* Cards below xl */}
      <div className="space-y-4 xl:hidden">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-medium text-foreground">{job.title}</h2>
              <StatusPill status={getJobStatus(job.deadline)} />
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-muted-foreground">{job.companyName}</p>
              <LocationLine job={job} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TypePill label={getJobTypeLabel(job.jobType)} />
              <span className="text-sm text-muted-foreground">
                {formatCompensation(job)}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Deadline {formatDate(job.deadline)} · Posted {formatDate(job.createdAt)}
            </p>
            <div className="mt-4">
              <RowActions
                job={job}
                pending={deletingId === job.id}
                onDelete={handleDelete}
              />
            </div>
          </article>
        ))}
      </div>

      {/* Table from xl */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card xl:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Your job posts</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Job
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Company
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Compensation
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Deadline
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <JobTitleCell job={job} />
                </td>
                <td className="px-4 py-3">
                  <span className="block text-sm text-foreground">{job.companyName}</span>
                  <LocationLine job={job} />
                </td>
                <td className="px-4 py-3">
                  <TypePill label={getJobTypeLabel(job.jobType)} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatCompensation(job)}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={getJobStatus(job.deadline)} />
                </td>
                <td className="px-4 py-3">
                  <span className="block text-foreground">{formatDate(job.deadline)}</span>
                  <span className="block text-xs text-muted-foreground">
                    Posted {formatDate(job.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RowActions
                    job={job}
                    pending={deletingId === job.id}
                    onDelete={handleDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
