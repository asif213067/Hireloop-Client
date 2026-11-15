"use client"

import { MapPinIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, type ReactNode } from "react"

import { DeleteJobDialog } from "@/components/dashboard/recruiter/delete-job-dialog"
import { JobActions } from "@/components/dashboard/recruiter/job-actions"
import { buttonVariants } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import {
  formatApplicants,
  formatCompensation,
  formatDate,
  getJobStatus,
  getJobTypeLabel,
  isJobResponse,
  type JobResponse,
} from "@/lib/jobs"
import { cn } from "@/lib/utils"

const headClass =
  "px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"

// Table headers in order; the Actions header is added separately on the right
const COLUMNS = [
  "Job Title & Dept",
  "Company & Location",
  "Type",
  "Compensation",
  "Applicants",
  "Status",
  "Deadline",
]

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

// Applicants count with the people icon
function ApplicantsText({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
      <UsersIcon aria-hidden className="size-4 text-primary" />
      {formatApplicants(count)}
    </span>
  )
}

// Title and category used in the table row
function JobTitleCell({ job }: { job: JobResponse }) {
  return (
    <>
      <span className="block text-sm font-medium text-foreground">
        {job.title}
      </span>
      <span className="block text-xs text-primary">{job.category}</span>
    </>
  )
}

// Small label above a value, used inside the mobile card
function DetailItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
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
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">(
    "loading"
  )
  const [jobToDelete, setJobToDelete] = useState<JobResponse | null>(null)

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

  // The dialog already deleted the job on the server; drop it from the list
  function handleDeleted(id: string) {
    setJobs((current) => current.filter((item) => item.id !== id))
    setJobToDelete(null)
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
      {/* Cards below xl */}
      <div className="space-y-4 xl:hidden">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base leading-snug font-semibold break-words text-foreground">
                  {job.title}
                </h2>
                <p className="mt-0.5 text-xs text-primary">{job.category}</p>
              </div>
              <StatusPill status={getJobStatus(job.deadline)} />
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-sm text-foreground/80">{job.companyName}</p>
              <LocationLine job={job} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <DetailItem label="Type">
                <TypePill label={getJobTypeLabel(job.jobType)} />
              </DetailItem>
              <DetailItem label="Compensation">
                {formatCompensation(job)}
              </DetailItem>
              <DetailItem label="Applicants">
                <ApplicantsText count={job.applicantsCount} />
              </DetailItem>
              <DetailItem label="Deadline">
                {formatDate(job.deadline)}
              </DetailItem>
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Posted {formatDate(job.createdAt)}
              </p>
              <JobActions job={job} onDelete={setJobToDelete} />
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
              {COLUMNS.map((column) => (
                <th key={column} scope="col" className={headClass}>
                  {column}
                </th>
              ))}
              <th scope="col" className={cn(headClass, "text-right")}>
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
                  <span className="block text-sm text-foreground">
                    {job.companyName}
                  </span>
                  <LocationLine job={job} />
                </td>
                <td className="px-4 py-3">
                  <TypePill label={getJobTypeLabel(job.jobType)} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatCompensation(job)}
                </td>
                <td className="px-4 py-3">
                  <ApplicantsText count={job.applicantsCount} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={getJobStatus(job.deadline)} />
                </td>
                <td className="px-4 py-3">
                  <span className="block text-foreground">
                    {formatDate(job.deadline)}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Posted {formatDate(job.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <JobActions job={job} onDelete={setJobToDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* One dialog for the whole list; the key resets it for each job */}
      {jobToDelete ? (
        <DeleteJobDialog
          key={jobToDelete.id}
          job={jobToDelete}
          onClose={() => setJobToDelete(null)}
          onDeleted={handleDeleted}
        />
      ) : null}
    </div>
  )
}
