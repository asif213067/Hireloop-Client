"use client"

import { useEffect, useState } from "react"
import {
  BookmarkIcon,
  ChevronDownIcon,
  ClockIcon,
  MapPinIcon,
  TimerIcon,
  WalletIcon,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { SaveButton } from "@/components/jobs/save-button"
import {
  fetchSavedJobs,
  unsaveJob,
  type SavedJob,
  type SavedJobsResponse,
} from "@/lib/saved-jobs-api"
import { formatCompensation } from "@/lib/jobs"

const cardClass = "rounded-xl border border-border bg-card p-4"
const chipClass =
  "inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground"
const applyLinkClass =
  "inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background outline-none hover:bg-foreground/90 focus-visible:ring-3 focus-visible:ring-ring/50"

// "2 hours ago" style text, copied from the applications view
function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ]
  for (const [size, name] of units) {
    const n = Math.floor(seconds / size)
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`
  }
  return "just now"
}

// Whole days from today to the deadline, both counted in UTC
function daysUntil(deadlineIso: string): number {
  const deadline = new Date(deadlineIso)
  const now = new Date()
  const deadlineDay = Date.UTC(
    deadline.getUTCFullYear(),
    deadline.getUTCMonth(),
    deadline.getUTCDate()
  )
  const todayDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  )
  return Math.round((deadlineDay - todayDay) / 86400000)
}

// "Closes today", "Closes tomorrow" or "Closes in N days"
function closingText(deadlineIso: string): string {
  const days = daysUntil(deadlineIso)
  if (days <= 0) return "Closes today"
  if (days === 1) return "Closes tomorrow"
  return `Closes in ${days} days`
}

// "Closed today", "Closed yesterday" or "Closed N days ago"
function closedText(deadlineIso: string): string {
  const days = -daysUntil(deadlineIso)
  if (days <= 0) return "Closed today"
  if (days === 1) return "Closed yesterday"
  return `Closed ${days} days ago`
}

// Square tile with an icon, a label and the number under it
function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookmarkIcon
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <span
        aria-hidden
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"
      >
        <Icon className="size-4 text-muted-foreground" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block text-xl font-semibold text-foreground">
          {value}
        </span>
      </span>
    </div>
  )
}

// One saved job; open jobs can be applied to, closed jobs can only be removed
function SavedJobCard({
  job,
  onRemoved,
}: {
  job: SavedJob
  onRemoved: (job: SavedJob) => void
}) {
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null

  // Remove from List: drop the save, then the card
  async function onRemove() {
    try {
      await unsaveJob(job.id)
      toast.success("Removed from saved jobs")
      onRemoved(job)
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update saved jobs. Please try again."
      )
    }
  }

  return (
    <div className={`relative ${cardClass} ${job.closed ? "opacity-60" : ""}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-lg font-semibold text-secondary-foreground"
          >
            {job.companyName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              {job.title}
            </h2>
            <span className="mt-1 inline-block rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground uppercase">
              {job.companyName}
            </span>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              <li className={chipClass}>
                <MapPinIcon
                  aria-hidden
                  className="size-3.5 text-muted-foreground"
                />
                {job.isRemote ? "Remote" : (job.location ?? "Remote")}
              </li>
              {hasSalary ? (
                <li className={chipClass}>
                  <WalletIcon
                    aria-hidden
                    className="size-3.5 text-muted-foreground"
                  />
                  {formatCompensation(job)}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon aria-hidden className="size-3.5" />
            Saved {timeAgo(job.savedAt)}
          </p>
          {job.closed ? (
            <>
              <p className="text-sm text-destructive">
                {closedText(job.deadline)}
              </p>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-destructive/40 px-4 text-sm text-destructive outline-none hover:bg-destructive/10 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Remove from List
              </button>
            </>
          ) : (
            <>
              {job.closingSoon ? (
                <p className="text-sm text-warning">
                  {closingText(job.deadline)}
                </p>
              ) : null}
              <div className="flex items-center gap-2">
                <SaveButton
                  jobId={job.id}
                  initialSaved
                  onToggle={(saved) => {
                    if (!saved) onRemoved(job)
                  }}
                />
                {job.applied ? (
                  <div className="flex flex-col items-center gap-1 sm:items-end">
                    {/* Server says this seeker already applied */}
                    <button
                      type="button"
                      disabled
                      className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-muted-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      Applied ✓
                    </button>
                    <Link
                      href="/dashboard/seeker/applications"
                      className="inline-flex min-h-11 items-center text-sm text-primary outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      View application
                    </Link>
                  </div>
                ) : (
                  <Link href={`/jobs/${job.id}`} className={applyLinkClass}>
                    Apply Now
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Saved jobs page for seekers
export function SavedJobsView() {
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [stats, setStats] = useState<SavedJobsResponse["stats"] | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [error, setError] = useState("")

  // First page decides the whole page state; state is set only in callbacks
  useEffect(() => {
    let cancelled = false
    fetchSavedJobs(1)
      .then((result) => {
        if (cancelled) return
        setJobs(result.jobs)
        setStats(result.stats)
        setPage(result.page)
        setHasMore(result.hasMore)
        setError("")
        setLoading(false)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Could not load saved jobs.")
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Load More: append the next page of jobs
  async function onLoadMore() {
    setMoreLoading(true)
    try {
      const result = await fetchSavedJobs(page + 1)
      setJobs((current) => [...current, ...result.jobs])
      setStats(result.stats)
      setPage(result.page)
      setHasMore(result.hasMore)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load saved jobs.")
    } finally {
      setMoreLoading(false)
    }
  }

  // A card left the list; keep the stat numbers honest
  function onRemoved(job: SavedJob) {
    setJobs((current) => current.filter((item) => item.id !== job.id))
    setStats((current) =>
      current === null
        ? current
        : {
            totalSaved: Math.max(0, current.totalSaved - 1),
            closingSoon:
              current.closingSoon - (job.closingSoon && !job.closed ? 1 : 0),
          }
    )
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Saved Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your bookmarked opportunities.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:w-80">
          <StatCard
            icon={BookmarkIcon}
            label="Total Saved"
            value={stats?.totalSaved ?? 0}
          />
          <StatCard
            icon={TimerIcon}
            label="Closing Soon"
            value={stats?.closingSoon ?? 0}
          />
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && error !== "" && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {!loading && error === "" && jobs.length === 0 ? (
        <div
          className={`${cardClass} p-8 text-center text-sm text-muted-foreground`}
        >
          You have no saved jobs yet.
          <div className="mt-3">
            <Link
              href="/jobs"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      ) : null}

      {!loading && error === "" && jobs.length > 0 ? (
        <>
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <SavedJobCard job={job} onRemoved={onRemoved} />
              </li>
            ))}
          </ul>
          {hasMore ? (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={onLoadMore}
                disabled={moreLoading}
                className="h-11 px-4"
              >
                <ChevronDownIcon aria-hidden className="size-4" />
                {moreLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
