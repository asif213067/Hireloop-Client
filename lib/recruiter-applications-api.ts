import { apiRequest } from "@/lib/api"
import type { ApplicationStatus } from "@/lib/applications-api"

export type RecruiterSettableStatus = Exclude<ApplicationStatus, "withdrawn">

export type RecruiterApplication = {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  applicantImage: string | null
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
  jobTitle: string
  companyName: string
  jobType: string
  isRemote: boolean
  location: string | null
}

export type RecruiterJobOption = {
  id: string
  title: string
  companyName: string
}

export type RecruiterApplicationsResponse = {
  applications: RecruiterApplication[]
  jobs: RecruiterJobOption[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  stats: {
    total: number
    reviewing: number
    shortlisted: number
    interview: number
    offered: number
  }
}

export async function fetchRecruiterApplications(params: {
  jobId?: string
  status?: string
  page?: number
}): Promise<RecruiterApplicationsResponse | null> {
  const query = new URLSearchParams()
  if (params.jobId && params.jobId !== "all") query.set("jobId", params.jobId)
  if (params.status && params.status !== "all") query.set("status", params.status)
  if (params.page && params.page > 1) query.set("page", String(params.page))

  const qs = query.toString()
  const res = await apiRequest(
    `/api/recruiter/applications${qs ? `?${qs}` : ""}`
  )
  if (res.status === 200 && res.data) {
    return res.data as RecruiterApplicationsResponse
  }
  return null
}

export async function updateRecruiterApplicationStatus(
  applicationId: string,
  status: RecruiterSettableStatus
): Promise<{ ok: boolean; status?: ApplicationStatus; updatedAt?: string; error?: string }> {
  const res = await apiRequest(
    `/api/recruiter/applications/${encodeURIComponent(applicationId)}/status`,
    {
      method: "PATCH",
      body: { status },
    }
  )

  const payload = res.data as {
    application?: { status: ApplicationStatus; updatedAt: string }
    error?: string
  } | null

  if (res.status === 200 && payload?.application) {
    return {
      ok: true,
      status: payload.application.status,
      updatedAt: payload.application.updatedAt,
    }
  }

  return {
    ok: false,
    error: payload?.error || "Could not update application status",
  }
}
