// Server-side fetchers for the public jobs API; they never throw to the page

import {
  isPublicJobDetail,
  isPublicJobsResponse,
  type PublicJobDetail,
  type PublicJobsResponse,
} from "@/lib/jobs"

// Time-based cache for both public endpoints
const REVALIDATE_SECONDS = 30

// Base URL from the env, trimmed like lib/api.ts, or null when missing
function getBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SERVER_BASE_URL
  if (typeof raw !== "string" || raw.trim() === "") return null
  return raw.trim().replace(/\/+$/, "")
}

// Public jobs list, or null on missing env, failed request or wrong shape
export async function fetchPublicJobs(
  apiQuery: URLSearchParams
): Promise<PublicJobsResponse | null> {
  const baseUrl = getBaseUrl()
  if (baseUrl === null) return null

  try {
    const response = await fetch(
      `${baseUrl}/api/public/jobs?${apiQuery.toString()}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    )
    if (!response.ok) return null

    const data: unknown = await response.json()
    return isPublicJobsResponse(data) ? data : null
  } catch {
    return null
  }
}

// One public job with its long-form sections; "not-found" on 404, null otherwise
export async function fetchPublicJob(
  id: string
): Promise<PublicJobDetail | "not-found" | null> {
  const baseUrl = getBaseUrl()
  if (baseUrl === null) return null

  try {
    const response = await fetch(
      `${baseUrl}/api/public/jobs/${encodeURIComponent(id)}`,
      { next: { revalidate: REVALIDATE_SECONDS } }
    )
    if (response.status === 404) return "not-found"
    if (!response.ok) return null

    const data: unknown = await response.json()
    if (typeof data !== "object" || data === null) return null
    const job = (data as Record<string, unknown>).job
    return isPublicJobDetail(job) ? job : null
  } catch {
    return null
  }
}
