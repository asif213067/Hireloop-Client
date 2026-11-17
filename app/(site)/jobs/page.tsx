import type { Metadata } from "next"
import Link from "next/link"
import { MapPinIcon, SearchIcon, XIcon } from "lucide-react"
import type { ReactNode } from "react"
import Form from "next/form"

import { FiltersPanel } from "@/components/jobs/filters-panel"
import { JobCards } from "@/components/jobs/job-cards"
import {
  POSTED_OPTIONS,
  SORT_OPTIONS,
  JobsFilters,
} from "@/components/jobs/jobs-filters"
import { AutoSubmit } from "@/components/jobs/auto-submit"
import { JobsPagination } from "@/components/jobs/jobs-pagination"
import { JOB_TYPES, getJobTypeLabel, type JobType } from "@/lib/jobs"
import { fetchPublicJobs } from "@/lib/public-jobs"

type SearchParams = Promise<{
  [key: string]: string | string[] | undefined
}>

type SearchValues = {
  q: string
  location: string
  type: string[]
  remote: boolean
  posted: string
  sort: string
  page: number
}

// Zero counts shown while the API is unavailable
const EMPTY_TYPE_COUNTS: Record<JobType, number> = {
  "full-time": 0,
  "part-time": 0,
  contract: 0,
  internship: 0,
}

const searchInputClass =
  "h-11 w-full rounded-lg border border-border bg-input/30 py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

const chipLinkClass =
  "flex min-h-11 items-center gap-1 rounded-md bg-secondary px-2 text-xs text-secondary-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

const clearLinkClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"

// First value of a search param, or "" when absent
function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

// All values of a repeated search param
function allValues(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value
  if (typeof value === "string" && value !== "") return [value]
  return []
}

// Whitelisted values from the URL; anything else falls back to the default
function parseSearch(
  params: Record<string, string | string[] | undefined>
): SearchValues {
  const type = allValues(params.type).filter((value) =>
    JOB_TYPES.some((jobType) => jobType.value === value)
  )
  const posted = firstValue(params.posted)
  const sort = firstValue(params.sort)
  const pageRaw = Number.parseInt(firstValue(params.page), 10)

  return {
    q: firstValue(params.q),
    location: firstValue(params.location),
    type,
    remote: firstValue(params.remote) === "true",
    posted: POSTED_OPTIONS.some((option) => option.value === posted)
      ? posted
      : "any",
    sort: SORT_OPTIONS.some((option) => option.value === sort)
      ? sort
      : "recent",
    page: Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1,
  }
}

// Params of the current URL as written; only meaningful values are kept
function buildCurrentParams(search: SearchValues): URLSearchParams {
  const params = new URLSearchParams()
  if (search.q !== "") params.set("q", search.q)
  if (search.location !== "") params.set("location", search.location)
  for (const value of search.type) params.append("type", value)
  if (search.remote) params.set("remote", "true")
  if (search.posted !== "any") params.set("posted", search.posted)
  if (search.sort !== "recent") params.set("sort", search.sort)
  if (search.page > 1) params.set("page", String(search.page))
  return params
}

// API query from the page values; empty strings and defaults are omitted
function buildApiQuery(search: SearchValues): URLSearchParams {
  const apiQuery = new URLSearchParams()
  if (search.q !== "") apiQuery.set("q", search.q)
  if (search.location !== "") apiQuery.set("location", search.location)
  // Repeated page params become one comma-separated value for the API
  if (search.type.length > 0) apiQuery.set("type", search.type.join(","))
  if (search.remote) apiQuery.set("remote", "true")
  if (search.posted !== "any") apiQuery.set("posted", search.posted)
  if (search.sort !== "recent") apiQuery.set("sort", search.sort)
  if (search.page > 1) apiQuery.set("page", String(search.page))
  return apiQuery
}

// href that removes one filter from the current URL and resets the page
function removeFilterHref(
  params: URLSearchParams,
  name: string,
  value?: string
): string {
  const next = new URLSearchParams(params)
  if (value === undefined) {
    next.delete(name)
  } else {
    const rest = next.getAll(name).filter((item) => item !== value)
    next.delete(name)
    for (const item of rest) next.append(name, item)
  }
  next.delete("page")
  const query = next.toString()
  return query === "" ? "/jobs" : `/jobs?${query}`
}

// href keeping only q and location
function clearFiltersHref(params: URLSearchParams): string {
  const next = new URLSearchParams()
  const q = params.get("q")
  const location = params.get("location")
  if (q) next.set("q", q)
  if (location) next.set("location", location)
  const query = next.toString()
  return query === "" ? "/jobs" : `/jobs?${query}`
}

// Label for a posted value, falling back to the raw value
function getPostedLabel(value: string): string {
  return POSTED_OPTIONS.find((option) => option.value === value)?.label ?? value
}

// Card for the empty list and the API-failure states
function NoticeCard({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-border bg-card p-6 text-center">
      {children}
    </div>
  )
}

// True when the URL carries any filter, so this exact result list is not indexed
function hasFilterParams(
  params: Record<string, string | string[] | undefined>
): boolean {
  const posted = firstValue(params.posted)
  const sort = firstValue(params.sort)
  const page = Number.parseInt(firstValue(params.page), 10)

  return (
    firstValue(params.q) !== "" ||
    firstValue(params.location) !== "" ||
    allValues(params.type).length > 0 ||
    firstValue(params.remote) === "true" ||
    (posted !== "" && posted !== "any") ||
    (sort !== "" && sort !== "recent") ||
    (Number.isInteger(page) && page > 1)
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const params = await searchParams

  return {
    title: "Browse jobs",
    description:
      "Search and filter open roles on HireLoop by keyword, location, job type and date posted.",
    alternates: { canonical: "/jobs" },
    ...(hasFilterParams(params)
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}

// Public jobs browse page; one GET form drives the whole URL state
export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const search = parseSearch(params)
  const result = await fetchPublicJobs(buildApiQuery(search))
  const currentParams = buildCurrentParams(search)
  const activeCount =
    search.type.length +
    (search.remote ? 1 : 0) +
    (search.posted === "any" ? 0 : 1)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="sr-only">Browse jobs</h1>
      {/* Remounting on every URL change resets the uncontrolled inputs */}
      <Form action="/jobs" key={currentParams.toString()}>
        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center">
            <div className="relative">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <label htmlFor="jobs-q" className="sr-only">
                Keywords
              </label>
              <input
                id="jobs-q"
                name="q"
                type="text"
                defaultValue={search.q}
                placeholder="Job title or keywords"
                className={searchInputClass}
              />
            </div>
            <div className="relative">
              <MapPinIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <label htmlFor="jobs-location" className="sr-only">
                Location
              </label>
              <input
                id="jobs-location"
                name="location"
                type="text"
                defaultValue={search.location}
                placeholder="City or country"
                className={searchInputClass}
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-lg bg-foreground px-4 text-sm font-medium text-background outline-none hover:bg-foreground/90 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Search Jobs
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[16rem_1fr]">
          <FiltersPanel activeCount={activeCount}>
            <JobsFilters
              type={search.type}
              remote={search.remote}
              posted={search.posted}
              typeCounts={
                result === null ? EMPTY_TYPE_COUNTS : result.typeCounts
              }
            />
          </FiltersPanel>
          <div className="min-w-0">
            {result === null ? (
              <NoticeCard>
                <p className="text-sm text-muted-foreground">
                  Jobs are temporarily unavailable. Please try again in a
                  moment.
                </p>
              </NoticeCard>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    aria-live="polite"
                    className="text-sm text-muted-foreground"
                  >
                    Found {result.total} {result.total === 1 ? "job" : "jobs"}
                  </p>
                  <AutoSubmit>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="jobs-sort"
                        className="text-sm text-muted-foreground"
                      >
                        Sort by
                      </label>
                      <select
                        id="jobs-sort"
                        name="sort"
                        defaultValue={search.sort}
                        className="h-11 rounded-lg border border-border bg-input/30 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {SORT_OPTIONS.filter(
                          (option) =>
                            option.value !== "match" || search.q !== ""
                        ).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </AutoSubmit>
                </div>
                {activeCount > 0 ? (
                  <ul className="mt-3 flex flex-wrap items-center gap-1.5">
                    {search.type.map((value) => (
                      <li key={value}>
                        <Link
                          href={removeFilterHref(currentParams, "type", value)}
                          aria-label={`Remove filter ${getJobTypeLabel(value)}`}
                          className={chipLinkClass}
                        >
                          {getJobTypeLabel(value)}
                          <XIcon aria-hidden className="size-3.5" />
                        </Link>
                      </li>
                    ))}
                    {search.remote ? (
                      <li>
                        <Link
                          href={removeFilterHref(currentParams, "remote")}
                          aria-label="Remove filter Remote only"
                          className={chipLinkClass}
                        >
                          Remote
                          <XIcon aria-hidden className="size-3.5" />
                        </Link>
                      </li>
                    ) : null}
                    {search.posted !== "any" ? (
                      <li>
                        <Link
                          href={removeFilterHref(currentParams, "posted")}
                          aria-label={`Remove filter ${getPostedLabel(search.posted)}`}
                          className={chipLinkClass}
                        >
                          {getPostedLabel(search.posted)}
                          <XIcon aria-hidden className="size-3.5" />
                        </Link>
                      </li>
                    ) : null}
                    <li>
                      <Link
                        href={clearFiltersHref(currentParams)}
                        className={clearLinkClass}
                      >
                        Clear filters
                      </Link>
                    </li>
                  </ul>
                ) : null}
                {result.jobs.length === 0 ? (
                  <NoticeCard>
                    <p className="text-sm text-foreground">
                      No jobs match your search.
                    </p>
                    <Link
                      href={clearFiltersHref(currentParams)}
                      className={clearLinkClass}
                    >
                      Clear filters
                    </Link>
                  </NoticeCard>
                ) : (
                  <>
                    <JobCards jobs={result.jobs} />
                    <JobsPagination
                      params={currentParams}
                      currentPage={search.page}
                      totalPages={result.totalPages}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Form>
    </div>
  )
}
