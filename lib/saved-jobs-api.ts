import { apiRequest } from "@/lib/api"
import { FREQUENCIES, type SalaryFrequency } from "@/lib/jobs"

// Any JSON object
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

// Array of strings
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

// The seeker's saved job ids, or null when the request fails
export async function fetchSavedJobIds(): Promise<string[] | null> {
  const { status, data } = await apiRequest("/api/saved-jobs/ids")
  if (status !== 200 || !isRecord(data) || !isStringArray(data.jobIds)) {
    return null
  }
  return data.jobIds
}

// 201 and 409 (already saved) both count as success
export async function saveJob(jobId: string): Promise<void> {
  const { status } = await apiRequest("/api/saved-jobs", {
    method: "POST",
    body: { jobId },
  })
  if (status === 201 || status === 409) return

  if (status === 404) throw new Error("This job is no longer open.")
  if (status === 429)
    throw new Error("Too many attempts. Please try again later.")
  throw new Error("Could not update saved jobs. Please try again.")
}

// 204 means the job is no longer saved
export async function unsaveJob(jobId: string): Promise<void> {
  const { status } = await apiRequest(
    `/api/saved-jobs/${encodeURIComponent(jobId)}`,
    { method: "DELETE" }
  )
  if (status === 204) return
  throw new Error("Could not update saved jobs. Please try again.")
}

// One saved job row from the list endpoint
export type SavedJob = {
  id: string
  title: string
  companyName: string
  jobType: string
  isRemote: boolean
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryFrequency: SalaryFrequency | null
  deadline: string
  closed: boolean
  closingSoon: boolean
  applied: boolean
  savedAt: string
}

export type SavedJobsResponse = {
  jobs: SavedJob[]
  stats: {
    totalSaved: number
    closingSoon: number
  }
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

// Type guard for one saved job row
function isSavedJob(value: unknown): value is SavedJob {
  if (!isRecord(value)) return false

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.companyName === "string" &&
    typeof value.jobType === "string" &&
    typeof value.isRemote === "boolean" &&
    (typeof value.location === "string" || value.location === null) &&
    (typeof value.salaryMin === "number" || value.salaryMin === null) &&
    (typeof value.salaryMax === "number" || value.salaryMax === null) &&
    ((typeof value.salaryFrequency === "string" &&
      FREQUENCIES.some(
        (frequency) => frequency.value === value.salaryFrequency
      )) ||
      value.salaryFrequency === null) &&
    typeof value.deadline === "string" &&
    typeof value.closed === "boolean" &&
    typeof value.closingSoon === "boolean" &&
    typeof value.applied === "boolean" &&
    typeof value.savedAt === "string"
  )
}

// Type guard for the saved jobs list envelope
function isSavedJobsResponse(value: unknown): value is SavedJobsResponse {
  if (!isRecord(value) || !Array.isArray(value.jobs)) return false
  if (!value.jobs.every(isSavedJob)) return false
  if (
    !isRecord(value.stats) ||
    typeof value.stats.totalSaved !== "number" ||
    typeof value.stats.closingSoon !== "number"
  ) {
    return false
  }

  return (
    typeof value.page === "number" &&
    typeof value.pageSize === "number" &&
    typeof value.total === "number" &&
    typeof value.hasMore === "boolean"
  )
}

// The seeker's saved jobs, newest page first
export async function fetchSavedJobs(page: number): Promise<SavedJobsResponse> {
  const { status, data } = await apiRequest(`/api/saved-jobs?page=${page}`)
  if (status !== 200 || !isSavedJobsResponse(data)) {
    throw new Error("Could not load saved jobs.")
  }
  return data
}
