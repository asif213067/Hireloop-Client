"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { UserAvatar } from "@/components/shared/user-avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import type { ApplicationStatus } from "@/lib/applications-api"
import {
  fetchRecruiterApplications,
  updateRecruiterApplicationStatus,
  type RecruiterApplication,
  type RecruiterApplicationsResponse,
  type RecruiterSettableStatus,
} from "@/lib/recruiter-applications-api"
import { cn } from "@/lib/utils"

const STATUS_STYLE: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: { label: "Applied", className: "bg-zinc-800 text-zinc-200" },
  reviewing: { label: "In review", className: "bg-amber-500/15 text-amber-300" },
  shortlisted: { label: "Shortlisted", className: "bg-blue-500/15 text-blue-300" },
  interview: { label: "Interview", className: "bg-violet-500/15 text-violet-300" },
  offered: { label: "Offered", className: "bg-emerald-500/15 text-emerald-300" },
  rejected: { label: "Rejected", className: "bg-red-500/15 text-red-300" },
  withdrawn: { label: "Withdrawn", className: "bg-zinc-800/80 text-zinc-400" },
}

const STATUS_OPTIONS: { value: RecruiterSettableStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "In review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
]

const FILTER_TABS = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "In review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
] as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

function formatLocation(app: RecruiterApplication) {
  if (app.isRemote && !app.location) return `${app.jobType} · Remote`
  if (app.isRemote && app.location) return `${app.jobType} · ${app.location} (Remote)`
  if (app.location) return `${app.jobType} · ${app.location}`
  return app.jobType
}

function StatusPill({ status }: { status: ApplicationStatus }) {
  const style = STATUS_STYLE[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        style.className
      )}
    >
      {style.label}
    </span>
  )
}

export function RecruiterApplicationsView() {
  const [jobId, setJobId] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [refreshTick, setRefreshTick] = useState(0)

  const [data, setData] = useState<RecruiterApplicationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    fetchRecruiterApplications({ jobId, status: statusFilter, page })
      .then((res) => {
        if (!ignore) {
          setData(res)
          setError(res === null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [jobId, statusFilter, page, refreshTick])

  const handleJobChange = (nextJobId: string) => {
    setLoading(true)
    setError(false)
    setJobId(nextJobId)
    setPage(1)
  }

  const handleStatusTab = (nextStatus: string) => {
    setLoading(true)
    setError(false)
    setStatusFilter(nextStatus)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setLoading(true)
    setError(false)
    setPage(nextPage)
  }

  const handleRetry = () => {
    setLoading(true)
    setError(false)
    setRefreshTick((t) => t + 1)
  }

  const handleStatusChange = async (
    applicationId: string,
    nextStatus: RecruiterSettableStatus
  ) => {
    if (updatingId) return
    setUpdatingId(applicationId)

    try {
      const result = await updateRecruiterApplicationStatus(
        applicationId,
        nextStatus
      )
      if (!result.ok) {
        toast.error(result.error || "Failed to update status")
        return
      }

      toast.success("Application status updated")
      setRefreshTick((t) => t + 1)
    } finally {
      setUpdatingId(null)
    }
  }

  const stats = data?.stats
  const jobs = data?.jobs ?? []
  const applications = data?.applications ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Candidate Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review applicants across your posted jobs and update their hiring stage.
          </p>
        </div>

        {jobs.length > 0 && (
          <div className="w-full sm:w-64">
            <label htmlFor="job-filter" className="sr-only">
              Filter by job
            </label>
            <select
              id="job-filter"
              value={jobId}
              onChange={(e) => handleJobChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="all">All posted jobs ({jobs.length})</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Summary Metrics */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            { label: "Total", value: stats.total },
            { label: "In Review", value: stats.reviewing },
            { label: "Shortlisted", value: stats.shortlisted },
            { label: "Interviews", value: stats.interview },
            { label: "Offered", value: stats.offered },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="text-xs font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => {
          const active = statusFilter === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleStatusTab(tab.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-16 animate-pulse rounded-xl border border-border bg-card/60" />
          <div className="h-16 animate-pulse rounded-xl border border-border bg-card/60" />
          <div className="h-16 animate-pulse rounded-xl border border-border bg-card/60" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Could not load candidate applications.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="mt-3"
          >
            Try again
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm font-medium text-foreground">
            You have not posted any jobs yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Post a job opening first to start receiving candidate applications.
          </p>
          <Link
            href="/dashboard/recruiter/jobs/new"
            className={cn(buttonVariants({ size: "sm" }), "mt-4")}
          >
            Post a Job
          </Link>
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm font-medium text-foreground">
            No applications match the selected filter
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try switching the job or status filter to view other candidates.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Applied</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Update Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applications.map((app) => {
                    const isWithdrawn = app.status === "withdrawn"
                    const isBusy = updatingId === app.id
                    return (
                      <tr
                        key={app.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={app.applicantName}
                              image={app.applicantImage}
                              className="size-9 shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/profiles/${app.applicantId}?from=recruiter-applications`}
                                className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
                              >
                                {app.applicantName}
                              </Link>
                              {app.applicantEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {app.applicantEmail}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <Link
                            href={`/jobs/${app.jobId}`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {app.jobTitle}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatLocation(app)}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <StatusPill status={app.status} />
                        </td>
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          {isWithdrawn ? (
                            <span className="text-xs text-muted-foreground">
                              Withdrawn by candidate
                            </span>
                          ) : (
                            <select
                              aria-label={`Update status for ${app.applicantName}`}
                              value={app.status}
                              disabled={isBusy || updatingId !== null}
                              onChange={(e) =>
                                handleStatusChange(
                                  app.id,
                                  e.target.value as RecruiterSettableStatus
                                )
                              }
                              className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none focus:border-primary disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {applications.map((app) => {
              const isWithdrawn = app.status === "withdrawn"
              const isBusy = updatingId === app.id
              return (
                <div
                  key={app.id}
                  className="space-y-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <UserAvatar
                        name={app.applicantName}
                        image={app.applicantImage}
                        className="size-9 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/profiles/${app.applicantId}?from=recruiter-applications`}
                          className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
                        >
                          {app.applicantName}
                        </Link>
                        {app.applicantEmail && (
                          <p className="truncate text-xs text-muted-foreground">
                            {app.applicantEmail}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusPill status={app.status} />
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <Link
                      href={`/jobs/${app.jobId}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {app.jobTitle}
                    </Link>
                    <p className="mt-0.5">{formatLocation(app)}</p>
                    <p className="mt-0.5">Applied {formatDate(app.createdAt)}</p>
                  </div>

                  {!isWithdrawn && (
                    <div className="pt-1">
                      <select
                        aria-label={`Update status for ${app.applicantName}`}
                        value={app.status}
                        disabled={isBusy || updatingId !== null}
                        onChange={(e) =>
                          handleStatusChange(
                            app.id,
                            e.target.value as RecruiterSettableStatus
                          )
                        }
                        className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground outline-none focus:border-primary disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>
                Page {data.page} of {data.totalPages} ({data.total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1}
                  onClick={() => handlePageChange(data.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={data.page >= data.totalPages}
                  onClick={() => handlePageChange(data.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
