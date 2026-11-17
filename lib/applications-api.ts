import { authClient } from "@/lib/auth-client"

// Base URL of the Express server, trimmed like lib/api.ts
const raw = process.env.NEXT_PUBLIC_SERVER_BASE_URL
const API = typeof raw === "string" ? raw.trim().replace(/\/+$/, "") : ""

// Thrown when the session is gone; the API maps it to a caller-visible state
class NotSignedInError extends Error {
  constructor() {
    super("Please sign in again")
  }
}

export type ApplicationStatus =
  | "applied"
  | "reviewing"
  | "shortlisted"
  | "interview"
  | "offered"
  | "rejected"
  | "withdrawn"

export type Application = {
  id: string
  jobId: string
  status: ApplicationStatus
  createdAt: string
  jobTitle: string
  companyName: string
  jobType: string
  isRemote: boolean
  location: string | null
}

export type ApplicationsResponse = {
  applications: Application[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  stats: {
    totalApplied: number
    shortlisted: number
    interviews: number
    successRate: number | null
  }
}

// Bearer request to the Express API; the token is fetched fresh each time
async function authFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  if (API === "") throw new Error("Could not connect to the server")

  const { data: tokenData, error: tokenError } = await authClient.token()
  const token: unknown = tokenData?.token
  if (tokenError !== null || typeof token !== "string" || token === "") {
    throw new NotSignedInError()
  }

  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  })
}

// Any JSON object
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

// Type guard for one application row from the API
function isApplication(value: unknown): value is Application {
  if (typeof value !== "object" || value === null) return false
  const item = value as Record<string, unknown>

  return (
    typeof item.id === "string" &&
    typeof item.jobId === "string" &&
    typeof item.status === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.jobTitle === "string" &&
    typeof item.companyName === "string" &&
    typeof item.jobType === "string" &&
    typeof item.isRemote === "boolean" &&
    (typeof item.location === "string" || item.location === null)
  )
}

// Type guard for the list response envelope
function isApplicationsResponse(value: unknown): value is ApplicationsResponse {
  if (typeof value !== "object" || value === null) return false
  const data = value as Record<string, unknown>
  if (!Array.isArray(data.applications)) return false
  if (!data.applications.every(isApplication)) return false

  return (
    typeof data.total === "number" &&
    typeof data.page === "number" &&
    typeof data.pageSize === "number" &&
    typeof data.totalPages === "number"
  )
}

export async function fetchMyApplications(
  tab: "active" | "archived",
  page: number
): Promise<ApplicationsResponse> {
  const res = await authFetch(
    `/api/applications/mine?status=${tab}&page=${page}`
  )
  if (!res.ok) throw new Error("Could not load applications")

  const data: unknown = await res.json()
  if (!isApplicationsResponse(data))
    throw new Error("Could not load applications")
  return data
}

// true or false from the status endpoint, null on any failure
export async function checkApplied(jobId: string): Promise<boolean | null> {
  try {
    const res = await authFetch(`/api/applications/status/${jobId}`)
    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Apply status failed:", res.status, res.url)
      }
      return null
    }

    const data: unknown = await res.json()
    return isRecord(data) && data.applied === true
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Apply status failed:", error)
    }
    return null
  }
}

// Every way an apply attempt can end; applyToJob never throws
export type ApplyResult =
  | "applied"
  | "already-applied"
  | "job-closed"
  | "not-seeker"
  | "not-signed-in"
  | "error"

export async function applyToJob(jobId: string): Promise<ApplyResult> {
  try {
    const res = await authFetch("/api/applications", {
      method: "POST",
      body: JSON.stringify({ jobId }),
    })
    if (res.status === 201) return "applied"
    if (res.status === 409) return "already-applied"

    // 404 means closed only when the server says so; another 404 is generic
    if (res.status === 404) {
      const data: unknown = await res.json().catch(() => null)
      if (isRecord(data) && data.error === "Job not available") {
        return "job-closed"
      }
      if (process.env.NODE_ENV !== "production") {
        const text = await res.text()
        console.error("Apply failed:", res.status, res.url, text)
      }
      return "error"
    }
    if (res.status === 403) return "not-seeker"
    if (res.status === 401) return "not-signed-in"

    if (process.env.NODE_ENV !== "production") {
      const text = await res.text()
      console.error("Apply failed:", res.status, res.url, text)
    }
    return "error"
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Apply failed:", error)
    }
    // A failed token fetch is a session problem, anything else is generic
    return error instanceof NotSignedInError ? "not-signed-in" : "error"
  }
}
