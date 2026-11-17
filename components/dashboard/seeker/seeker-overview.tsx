"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookmarkIcon,
  CalendarCheckIcon,
  MedalIcon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  fetchSeekerSummary,
  type ActivityItem,
  type ApplicationStatus,
  type SeekerSummary,
} from "@/lib/applications-api"

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; summary: SeekerSummary }

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  reviewing: "Under Review",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offered: "Offered",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
}

// "2 hours ago" style text
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

// Text of one activity row; label is the quoted status, when there is one
function getActivityMessage(item: ActivityItem) {
  if (item.status === "applied") {
    return {
      before: `You applied for ${item.jobTitle} at ${item.companyName}`,
      label: null,
    }
  }
  return {
    before: `Application for ${item.jobTitle} at ${item.companyName} updated to`,
    label: STATUS_LABEL[item.status],
  }
}

// Color of the quoted status
function statusColor(status: ApplicationStatus) {
  if (status === "offered") return "text-success"
  if (status === "rejected" || status === "withdrawn") return "text-destructive"
  return "text-warning"
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const message = getActivityMessage(item)
  const Icon = item.status === "applied" ? SendIcon : RefreshCwIcon

  return (
    <li className="flex flex-col gap-1 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Icon className="size-4" />
        </span>
        <p className="min-w-0 text-sm break-words text-foreground/90">
          {message.before}
          {message.label && (
            <>
              {" "}
              <span className={statusColor(item.status)}>
                “{message.label}”
              </span>
            </>
          )}
        </p>
      </div>
      <span className="text-xs whitespace-nowrap text-muted-foreground">
        {timeAgo(item.updatedAt)}
      </span>
    </li>
  )
}

export function SeekerOverview() {
  const [state, setState] = useState<State>({ status: "loading" })
  const [attempt, setAttempt] = useState(0)

  // State is set only after the server answers, never directly in the effect
  useEffect(() => {
    let cancelled = false
    fetchSeekerSummary().then((summary) => {
      if (cancelled) return
      setState(summary ? { status: "ready", summary } : { status: "error" })
    })
    return () => {
      cancelled = true
    }
  }, [attempt])

  function retry() {
    setState({ status: "loading" })
    setAttempt((n) => n + 1)
  }

  if (state.status === "loading") {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        Loading your dashboard...
      </p>
    )
  }

  if (state.status === "error") {
    return (
      <div className="space-y-3">
        <p role="alert" className="text-sm text-destructive">
          Could not load your dashboard. Please try again.
        </p>
        <Button variant="outline" className="h-11" onClick={retry}>
          Try again
        </Button>
      </div>
    )
  }

  const { stats, recent } = state.summary

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Saved Jobs"
          value={stats.savedJobs}
          icon={BookmarkIcon}
        />
        <StatCard
          label="Applications Submitted"
          value={stats.applications}
          icon={SendIcon}
        />
        <StatCard
          label="Interviews Scheduled"
          value={stats.interviews}
          icon={CalendarCheckIcon}
          iconClassName="text-warning"
        />
        <StatCard
          label="Offers Received"
          value={stats.offers}
          icon={MedalIcon}
          iconClassName="text-success"
        />
      </div>

      {/* Recent activity */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/seeker/applications"
            className="inline-flex min-h-11 items-center rounded-lg px-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            View All Activity
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No activity yet. Applications you send will appear here.
            </p>
            <Link
              href="/jobs"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
