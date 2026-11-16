// Shared job constants, types and client-side validation for the post-a-job form

export const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const

export const CATEGORIES = [
  "Engineering & Tech",
  "Design",
  "Product",
  "Product Management",
  "Marketing",
  "Sales",
  "Data & Analytics",
  "Customer Support",
  "Finance",
  "Human Resources",
  "Operations",
  "Other",
] as const

export const FREQUENCIES = [
  { value: "hour", label: "per hour" },
  { value: "day", label: "per day" },
  { value: "week", label: "per week" },
  { value: "month", label: "per month" },
  { value: "year", label: "per year" },
] as const

// Job type values accepted by the server
export type JobType = (typeof JOB_TYPES)[number]["value"]

// Category values accepted by the server
export type JobCategory = (typeof CATEGORIES)[number]

// Salary frequency values accepted by the server
export type SalaryFrequency = (typeof FREQUENCIES)[number]["value"]

// Form state: raw strings so users can type freely, validated on submit
export type JobFormValues = {
  title: string
  companyName: string
  category: string
  jobType: JobType | ""
  isRemote: boolean
  location: string
  deadline: string
  salaryMin: string
  salaryMax: string
  salaryFrequency: SalaryFrequency | ""
  responsibilities: string
  requirements: string
  website: string
}

// Payload sent to the API: numbers for salary, dates as YYYY-MM-DD
export type JobPayload = {
  title: string
  companyName: string
  category: JobCategory
  jobType: JobType
  isRemote: boolean
  location: string
  deadline: string
  salaryMin?: number
  salaryMax?: number
  salaryFrequency?: SalaryFrequency
  responsibilities: string
  requirements: string
  website: string
}

// Job shape returned by the API; id is a string, nullables are null
export type JobResponse = {
  id: string
  title: string
  companyName: string
  category: JobCategory
  jobType: JobType
  isRemote: boolean
  location: string | null
  deadline: string
  salaryMin: number | null
  salaryMax: number | null
  salaryFrequency: SalaryFrequency | null
  responsibilities: string
  requirements: string
  status: string
  applicantsCount: number
  createdAt: string
  updatedAt: string
}

// Local today as YYYY-MM-DD so deadline comparison never drifts with UTC
export function localToday(): string {
  const now = new Date()
  const month = `${now.getMonth() + 1}`.padStart(2, "0")
  const day = `${now.getDate()}`.padStart(2, "0")
  return `${now.getFullYear()}-${month}-${day}`
}

// A calendar date in YYYY-MM-DD form
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number) as [
    number,
    number,
    number,
  ]
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

// A number when the field is filled, undefined when left empty, NaN when invalid
function parseSalary(value: string): number | undefined {
  const trimmed = value.trim()
  if (trimmed === "") return undefined
  return Number(trimmed)
}

// Pure client-side mirror of the server rules; keys match field names
export function validateJob(values: JobFormValues): Record<string, string> {
  const errors: Record<string, string> = {}

  const title = values.title.trim()
  if (title.length < 3 || title.length > 120) {
    errors.title = "Title must be 3 to 120 characters."
  }

  const companyName = values.companyName.trim()
  if (companyName.length < 2 || companyName.length > 120) {
    errors.companyName = "Company name must be 2 to 120 characters."
  }

  if (!CATEGORIES.some((category) => category === values.category)) {
    errors.category = "Choose a job category."
  }

  if (values.jobType === "") {
    errors.jobType = "Choose a job type."
  }

  if (!values.isRemote) {
    const location = values.location.trim()
    if (location.length < 2 || location.length > 120) {
      errors.location = "Location must be 2 to 120 characters."
    }
  }

  if (values.deadline === "") {
    errors.deadline = "Pick an application deadline."
  } else if (!isIsoDate(values.deadline)) {
    errors.deadline = "Enter a valid date."
  } else if (values.deadline < localToday()) {
    errors.deadline = "The deadline must be today or later."
  }

  const salaryMin = parseSalary(values.salaryMin)
  const salaryMax = parseSalary(values.salaryMax)
  const hasSalary = salaryMin !== undefined || salaryMax !== undefined

  if (hasSalary && values.salaryFrequency === "") {
    errors.salaryFrequency = "Choose a frequency for the salary."
  }

  if (
    salaryMin !== undefined &&
    (Number.isNaN(salaryMin) || salaryMin < 0 || salaryMin > 10_000_000)
  ) {
    errors.salaryMin = "Salary must be between 0 and 10,000,000."
  }

  if (
    salaryMax !== undefined &&
    (Number.isNaN(salaryMax) || salaryMax < 0 || salaryMax > 10_000_000)
  ) {
    errors.salaryMax = "Salary must be between 0 and 10,000,000."
  }

  if (
    salaryMin !== undefined &&
    salaryMax !== undefined &&
    !Number.isNaN(salaryMin) &&
    !Number.isNaN(salaryMax) &&
    salaryMax < salaryMin
  ) {
    errors.salaryMax = "Max salary must be greater than or equal to min."
  }

  const responsibilities = values.responsibilities.trim()
  if (responsibilities.length < 20 || responsibilities.length > 5000) {
    errors.responsibilities = "Responsibilities must be 20 to 5000 characters."
  }

  const requirements = values.requirements.trim()
  if (requirements.length < 20 || requirements.length > 5000) {
    errors.requirements = "Requirements must be 20 to 5000 characters."
  }

  return errors
}

// Active until the deadline day has passed
export function getJobStatus(deadlineIso: string): "active" | "expired" {
  return deadlineIso.slice(0, 10) < localToday() ? "expired" : "active"
}

// Compact number for the compensation line, e.g. €1.2K
function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value)
}

// "€25 – €40 / hr" style text for a job's salary range
export function formatCompensation(
  job: Pick<JobResponse, "salaryMin" | "salaryMax" | "salaryFrequency">
): string {
  if (job.salaryMin === null && job.salaryMax === null) return "Not specified"

  const parts: string[] = []
  if (job.salaryMin !== null) parts.push(`€${formatCompact(job.salaryMin)}`)
  if (job.salaryMax !== null && job.salaryMax !== job.salaryMin) {
    parts.push(`€${formatCompact(job.salaryMax)}`)
  }
  const range = parts.join(" – ")

  const shortFrequency: Record<SalaryFrequency, string> = {
    hour: "/ hr",
    day: "/ day",
    week: "/ wk",
    month: "/ mo",
    year: "/ yr",
  }
  const suffix =
    job.salaryFrequency === null
      ? ""
      : ` ${shortFrequency[job.salaryFrequency]}`

  return `${range}${suffix}`
}

// "May 30, 2025" for deadline and posted dates
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso))
}

// "0 applicants", "1 applicant", "12 applicants"
export function formatApplicants(count: number): string {
  return count === 1 ? "1 applicant" : `${count} applicants`
}

// Label for a job type value, falling back to the raw value
export function getJobTypeLabel(value: string): string {
  return JOB_TYPES.find((type) => type.value === value)?.label ?? value
}

// Public job shape: the fields an anonymous visitor may see, no status or counters
export type PublicJob = {
  id: string
  title: string
  companyName: string
  category: JobCategory
  jobType: JobType
  isRemote: boolean
  location: string | null
  deadline: string
  salaryMin: number | null
  salaryMax: number | null
  salaryFrequency: SalaryFrequency | null
  createdAt: string
}

// Detail endpoint returns the same job plus the long-form sections
export type PublicJobDetail = PublicJob & {
  responsibilities: string
  requirements: string
}

// Counts of open jobs per type, used by the public filter panel
export type PublicJobTypeCounts = Record<JobType, number>

// Response envelope of the public list endpoint
export type PublicJobsResponse = {
  jobs: PublicJob[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  typeCounts: PublicJobTypeCounts
}

// Type guard for a public job from the API, in the style of isJobResponse
export function isPublicJob(value: unknown): value is PublicJob {
  if (typeof value !== "object" || value === null) return false
  const job = value as Record<string, unknown>

  return (
    typeof job.id === "string" &&
    typeof job.title === "string" &&
    typeof job.companyName === "string" &&
    CATEGORIES.some((category) => category === job.category) &&
    JOB_TYPES.some((type) => type.value === job.jobType) &&
    typeof job.isRemote === "boolean" &&
    (typeof job.location === "string" || job.location === null) &&
    typeof job.deadline === "string" &&
    (typeof job.salaryMin === "number" || job.salaryMin === null) &&
    (typeof job.salaryMax === "number" || job.salaryMax === null) &&
    ((typeof job.salaryFrequency === "string" &&
      FREQUENCIES.some(
        (frequency) => frequency.value === job.salaryFrequency
      )) ||
      job.salaryFrequency === null) &&
    typeof job.createdAt === "string"
  )
}

// Type guard for the detail payload, which adds the long-form sections
export function isPublicJobDetail(value: unknown): value is PublicJobDetail {
  if (!isPublicJob(value)) return false
  const job = value as Record<string, unknown>

  return (
    typeof job.responsibilities === "string" &&
    typeof job.requirements === "string"
  )
}

// Every type key present with a number count
function isPublicJobTypeCounts(value: unknown): value is PublicJobTypeCounts {
  if (typeof value !== "object" || value === null) return false
  const counts = value as Record<string, unknown>

  return JOB_TYPES.every((type) => typeof counts[type.value] === "number")
}

// Type guard for the list response envelope
export function isPublicJobsResponse(
  value: unknown
): value is PublicJobsResponse {
  if (typeof value !== "object" || value === null) return false
  const data = value as Record<string, unknown>

  return (
    Array.isArray(data.jobs) &&
    data.jobs.every(isPublicJob) &&
    typeof data.total === "number" &&
    typeof data.page === "number" &&
    typeof data.pageSize === "number" &&
    typeof data.totalPages === "number" &&
    isPublicJobTypeCounts(data.typeCounts)
  )
}

// Type guard for a job from the API, including the enum values
export function isJobResponse(value: unknown): value is JobResponse {
  if (typeof value !== "object" || value === null) return false
  const job = value as Record<string, unknown>

  return (
    typeof job.id === "string" &&
    typeof job.title === "string" &&
    typeof job.companyName === "string" &&
    CATEGORIES.some((category) => category === job.category) &&
    JOB_TYPES.some((type) => type.value === job.jobType) &&
    typeof job.isRemote === "boolean" &&
    (typeof job.location === "string" || job.location === null) &&
    typeof job.deadline === "string" &&
    (typeof job.salaryMin === "number" || job.salaryMin === null) &&
    (typeof job.salaryMax === "number" || job.salaryMax === null) &&
    ((typeof job.salaryFrequency === "string" &&
      FREQUENCIES.some(
        (frequency) => frequency.value === job.salaryFrequency
      )) ||
      job.salaryFrequency === null) &&
    typeof job.responsibilities === "string" &&
    typeof job.requirements === "string" &&
    typeof job.status === "string" &&
    typeof job.applicantsCount === "number" &&
    typeof job.createdAt === "string" &&
    typeof job.updatedAt === "string"
  )
}
