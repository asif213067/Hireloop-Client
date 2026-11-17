"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  fetchMyApplications,
  type ApplicationsResponse,
  type ApplicationStatus,
} from "@/lib/applications-api"

type Tab = "active" | "archived"

const STATUS_STYLE: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: { label: "Applied", className: "bg-gray-100 text-gray-700" },
  reviewing: { label: "In review", className: "bg-amber-100 text-amber-800" },
  shortlisted: { label: "Shortlisted", className: "bg-blue-100 text-blue-800" },
  interview: { label: "Interview", className: "bg-violet-100 text-violet-800" },
  offered: { label: "Offered", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  withdrawn: { label: "Withdrawn", className: "bg-gray-100 text-gray-500" },
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

function StatusPill({ status }: { status: ApplicationStatus }) {
  const style = STATUS_STYLE[status]
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${style.className}`}
    >
      {style.label}
    </span>
  )
}

// "Full-time • Remote" or "Full-time • Dhaka"
function jobMeta(a: {
  jobType: string
  isRemote: boolean
  location: string | null
}) {
  if (a.isRemote) return `${a.jobType} • Remote`
  if (a.location) return `${a.jobType} • ${a.location}`
  return a.jobType
}

export function ApplicationsView() {
  const [tab, setTab] = useState<Tab>("active")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<ApplicationsResponse | null>(null)
  // The tab and page the data on screen belongs to
  const [loadedKey, setLoadedKey] = useState("")
  const [error, setError] = useState("")

  const key = `${tab}:${page}`
  const loading = loadedKey !== key

  // State is set only after the server answers, never directly in the effect
  useEffect(() => {
    let cancelled = false
    fetchMyApplications(tab, page)
      .then((result) => {
        if (cancelled) return
        setData(result)
        setError("")
        setLoadedKey(`${tab}:${page}`)
      })
      .catch((e) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Something went wrong")
        setLoadedKey(`${tab}:${page}`)
      })
    return () => {
      cancelled = true
    }
  }, [tab, page])

  function switchTab(next: Tab) {
    setTab(next)
    setPage(1)
  }

  const stats = data?.stats
  const cards = [
    { label: "Total Applied", value: stats ? String(stats.totalApplied) : "—" },
    { label: "Shortlisted", value: stats ? String(stats.shortlisted) : "—" },
    { label: "Interviews", value: stats ? String(stats.interviews) : "—" },
    {
      label: "Success Rate",
      value:
        stats && stats.successRate !== null ? `${stats.successRate}%` : "—",
    },
  ]

  const showList = !loading && !error && data !== null
  const from = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0
  const to = data ? Math.min(data.page * data.pageSize, data.total) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            My Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Track the jobs you have applied to.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-border p-1">
          {(["active", "archived"] as const).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={tab === t ? "default" : "ghost"}
              onClick={() => switchTab(t)}
              className="capitalize"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && error && <p className="text-sm text-red-600">{error}</p>}

      {/* Empty state */}
      {showList && data.applications.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {tab === "active"
            ? "You have no active applications yet."
            : "No archived applications."}
          {tab === "active" && (
            <div className="mt-3">
              <Link
                href="/jobs"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Browse jobs
              </Link>
            </div>
          )}
        </div>
      )}

      {showList && data.applications.length > 0 && (
        <>
          {/* Table from md and up */}
          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="p-3 font-medium">Job Title</th>
                  <th className="p-3 font-medium">Company</th>
                  <th className="p-3 font-medium">Applied</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {data.applications.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="p-3">
                      <div className="font-medium text-foreground">
                        {a.jobTitle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {jobMeta(a)}
                      </div>
                    </td>
                    <td className="p-3 text-foreground">{a.companyName}</td>
                    <td className="p-3 text-muted-foreground">
                      {timeAgo(a.createdAt)}
                    </td>
                    <td className="p-3">
                      <StatusPill status={a.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/jobs/${a.jobId}`}
                        className="text-primary hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on phones */}
          <div className="space-y-3 md:hidden">
            {data.applications.map((a) => (
              <div
                key={a.id}
                className="space-y-2 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{a.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {a.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {jobMeta(a)}
                    </p>
                  </div>
                  <StatusPill status={a.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{timeAgo(a.createdAt)}</span>
                  <Link
                    href={`/jobs/${a.jobId}`}
                    className="text-primary hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {from}–{to} of {data.total} applications
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
