import Link from "next/link"

import { formatCompensation, getJobTypeLabel, type PublicJob } from "@/lib/jobs"

// "New" while created less than 3 days ago; NaN on a bad date means not new
function isNewJob(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 3 * 24 * 60 * 60 * 1000
}

// One card in the public jobs list; the title link covers the whole card
export function JobCard({ job }: { job: PublicJob }) {
  const isNew = isNewJob(job.createdAt)
  const hasSalary = job.salaryMin !== null || job.salaryMax !== null

  const chips = [
    hasSalary ? formatCompensation(job) : null,
    getJobTypeLabel(job.jobType),
    job.isRemote ? "Remote" : null,
    isNew ? "New" : null,
  ].filter((chip) => chip !== null)

  return (
    <article className="relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-lg font-semibold text-secondary-foreground"
        >
          {job.companyName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">
            <Link
              href={`/jobs/${job.id}`}
              className="rounded-lg outline-none after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {job.title}
            </Link>
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {job.companyName} • {job.location ?? "Remote"}
          </p>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <li
            key={chip}
            className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
          >
            {chip}
          </li>
        ))}
      </ul>
    </article>
  )
}
