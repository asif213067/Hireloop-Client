import type { Metadata } from "next"
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { fetchPublicJob } from "@/lib/public-jobs"
import { formatDate, formatCompensation, getJobTypeLabel } from "@/lib/jobs"
import { ApplyButton } from "@/components/jobs/apply-button"
import { SaveButton } from "@/components/jobs/save-button"

type Params = Promise<{ id: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { id } = await params
  const result = await fetchPublicJob(id)

  if (result === null) return { title: "Job unavailable" }
  if (result === "not-found") return { title: "Job not found" }

  return {
    title: `${result.title} at ${result.companyName}`,
    description: result.responsibilities.slice(0, 150),
  }
}

const tileClass = "min-w-0 rounded-xl border border-border bg-card p-3 sm:p-4"
const tileLabelClass =
  "mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
const tileValueClass = "mt-0.5 text-sm font-semibold text-foreground"

// Small stat tile with an icon, a label and the value underneath
function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className={tileClass}>
      <Icon aria-hidden className="size-4 text-muted-foreground" />
      <p className={tileLabelClass}>{label}</p>
      <p className={tileValueClass}>{value}</p>
    </div>
  )
}

// One labelled row of the overview card
function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm text-foreground">
        {value}
      </span>
    </div>
  )
}

// Section with a divider on top, matching the reference layout
function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border px-4 py-6 first:border-t-0 sm:px-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 text-sm whitespace-pre-line text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

// Public job detail page for anonymous visitors
export default async function Page({ params }: { params: Params }) {
  const { id } = await params
  const job = await fetchPublicJob(id)
  if (job === "not-found") notFound()

  if (job === null) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Jobs are temporarily unavailable. Please try again in a moment.
          </p>
        </div>
      </div>
    )
  }

  const hasSalary = job.salaryMin !== null || job.salaryMax !== null

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <Link
        href="/jobs"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Back to all jobs
      </Link>
      <article className="mt-2">
        {/* Header card: avatar, title, verified badge and the action buttons */}
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-start gap-4">
            <div
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg font-semibold text-secondary-foreground sm:size-14 sm:rounded-xl sm:text-xl"
            >
              {job.companyName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                {job.title}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                {job.companyName}
                <span aria-hidden>•</span>
                <span className="inline-flex items-center gap-1 text-success">
                  <BadgeCheckIcon aria-hidden className="size-4" />
                  Verified Employer
                </span>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:pl-4">
            <SaveButton jobId={id} />
            <ApplyButton
              jobId={id}
              jobTitle={job.title}
              className="h-11 px-4"
            />
          </div>
        </header>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0">
            {/* Stat tiles, two per row on phones and four from sm */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoTile
                icon={WalletIcon}
                label="Salary Range"
                value={hasSalary ? formatCompensation(job) : "Not specified"}
              />
              <InfoTile
                icon={MapPinIcon}
                label="Location"
                value={job.location ?? "Remote"}
              />
              <InfoTile
                icon={BriefcaseIcon}
                label="Job Type"
                value={getJobTypeLabel(job.jobType)}
              />
              <InfoTile
                icon={CalendarIcon}
                label="Apply By"
                value={formatDate(job.deadline)}
              />
            </div>
            {/* Long-form sections straight from the stored plain text */}
            <div className="mt-4 rounded-2xl border border-border bg-card">
              <DetailSection title="Responsibilities">
                {job.responsibilities}
              </DetailSection>
              <DetailSection title="Requirements">
                {job.requirements}
              </DetailSection>
            </div>
          </div>
          <aside>
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h2 className="text-base font-semibold text-foreground">
                Job Overview
              </h2>
              <div className="mt-3">
                <OverviewRow label="Company" value={job.companyName} />
                <OverviewRow label="Category" value={job.category} />
                <OverviewRow
                  label="Work Arrangement"
                  value={job.isRemote ? "Remote" : "On-site"}
                />
                <OverviewRow label="Posted" value={formatDate(job.createdAt)} />
                <OverviewRow
                  label="Apply By"
                  value={formatDate(job.deadline)}
                />
              </div>
              <Link
                href="/jobs"
                className="mt-4 flex h-11 w-full items-center justify-center rounded-lg border border-border bg-card text-sm font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Back to all jobs
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}
