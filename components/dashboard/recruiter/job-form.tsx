"use client"

import {
  ArrowRightIcon,
  BuildingIcon,
  CalendarIcon,
  MapPinIcon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useSyncExternalStore,
  useState,
  useEffect,
  type FormEvent,
} from "react"

import {
  JobSelectField,
  JobTextField,
  JobTextareaField,
  JobTypeRadioGroup,
  RemoteSwitchField,
  SectionCard,
} from "@/components/dashboard/form-fields"
import { Button, buttonVariants } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import {
  CATEGORIES,
  FREQUENCIES,
  JOB_TYPES,
  isJobResponse,
  type JobCategory,
  type JobFormValues,
  type JobPayload,
  validateJob,
} from "@/lib/jobs"
import { cn } from "@/lib/utils"

const FORM_ID = "new-job-form"
const GENERIC_ERROR = "Something went wrong. Please try again."
const FIX_ERRORS = "Please fix the highlighted fields below."

// Validated field order; also used to focus the first invalid control
const FIELD_ORDER = [
  "title",
  "companyName",
  "category",
  "jobType",
  "location",
  "deadline",
  "salaryMin",
  "salaryMax",
  "salaryFrequency",
  "responsibilities",
  "requirements",
] as const

type FieldKey = (typeof FIELD_ORDER)[number]

const INITIAL_VALUES: JobFormValues = {
  title: "",
  companyName: "",
  category: "",
  jobType: "",
  isRemote: false,
  location: "",
  deadline: "",
  salaryMin: "",
  salaryMax: "",
  salaryFrequency: "",
  responsibilities: "",
  requirements: "",
  website: "",
}

const CATEGORY_OPTIONS = CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

// Primary-styled Link used for the panel actions
const linkButtonClass = cn(
  buttonVariants({ size: "lg" }),
  "inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
)

// Publishing flag shared by both submit buttons across client boundaries
let isPublishing = false
const publishingListeners = new Set<() => void>()

function setPublishing(next: boolean) {
  isPublishing = next
  for (const listener of publishingListeners) listener()
}

function subscribePublishing(listener: () => void) {
  publishingListeners.add(listener)
  return () => {
    publishingListeners.delete(listener)
  }
}

function useIsPublishing(): boolean {
  return useSyncExternalStore(
    subscribePublishing,
    () => isPublishing,
    () => false
  )
}

// Anything shaped like an object
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

// 400 body → field errors, keeping only known keys and string messages
function mapServerErrors(
  body: unknown
): Partial<Record<FieldKey, string>> | null {
  if (!isRecord(body) || !isRecord(body.errors)) return null
  const mapped: Partial<Record<FieldKey, string>> = {}
  for (const key of FIELD_ORDER) {
    const value: unknown = body.errors[key]
    if (typeof value === "string" && value !== "") mapped[key] = value
  }
  return Object.keys(mapped).length > 0 ? mapped : null
}

// Form values → API payload; shapes are guaranteed by validateJob before submit
function buildPayload(values: JobFormValues): JobPayload {
  const salaryMin =
    values.salaryMin.trim() === "" ? undefined : Number(values.salaryMin)
  const salaryMax =
    values.salaryMax.trim() === "" ? undefined : Number(values.salaryMax)

  return {
    title: values.title.trim(),
    companyName: values.companyName.trim(),
    category: values.category as JobCategory,
    jobType: values.jobType as JobPayload["jobType"],
    isRemote: values.isRemote,
    location: values.location.trim(),
    deadline: values.deadline,
    salaryMin,
    salaryMax,
    salaryFrequency:
      values.salaryFrequency === "" ? undefined : values.salaryFrequency,
    responsibilities: values.responsibilities.trim(),
    requirements: values.requirements.trim(),
    website: values.website,
  }
}

// Focus the first control that has an error
function focusFirstError(errors: Partial<Record<FieldKey, string>>) {
  for (const key of FIELD_ORDER) {
    if (errors[key] === undefined) continue
    if (key === "jobType") {
      document.querySelector<HTMLInputElement>('input[name="jobType"]')?.focus()
    } else {
      document.getElementById(key)?.focus()
    }
    return
  }
}

// Header submit button; lives next to the page heading and binds via the form id
export function PublishJobButton({
  label = "Publish Job",
  busyLabel = "Publishing...",
  className,
}: {
  label?: string
  busyLabel?: string
  className?: string
}) {
  const publishing = useIsPublishing()

  return (
    <Button
      type="submit"
      form={FORM_ID}
      disabled={publishing}
      size="lg"
      className={cn("h-11 px-5", className)}
    >
      {publishing ? (
        busyLabel
      ) : (
        <>
          {label}
          <ArrowRightIcon
            data-icon="inline-end"
            aria-hidden
            className="size-4"
          />
        </>
      )}
    </Button>
  )
}

type JobFormState = "idle" | "submitting" | "success"
type JobLoadState = "idle" | "loading" | "notFound"

// Recruiter job posting form; posts to the Express API with a fresh JWT
export function JobForm({ jobId }: { jobId?: string }) {
  const router = useRouter()
  const editing = jobId !== undefined

  const [values, setValues] = useState<JobFormValues>(INITIAL_VALUES)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldKey, string>>
  >({})
  const [formError, setFormError] = useState<string | null>(null)
  const [state, setState] = useState<JobFormState>("idle")
  // Edit mode starts in the loading state until the job arrives
  const [loadState, setLoadState] = useState<JobLoadState>(
    jobId === undefined ? "idle" : "loading"
  )

  const submitting = state === "submitting"

  // Edit mode: load the job once and prefill the form
  useEffect(() => {
    if (jobId === undefined) return
    let cancelled = false

    async function loadJob() {
      const { status, data } = await apiRequest(`/api/jobs/${jobId}`)
      if (cancelled) return
      if (status === 200 && isRecord(data) && isJobResponse(data.job)) {
        const job = data.job
        setValues({
          title: job.title,
          companyName: job.companyName,
          category: job.category,
          jobType: job.jobType,
          isRemote: job.isRemote,
          location: job.location ?? "",
          deadline: job.deadline.slice(0, 10),
          salaryMin: job.salaryMin === null ? "" : String(job.salaryMin),
          salaryMax: job.salaryMax === null ? "" : String(job.salaryMax),
          salaryFrequency: job.salaryFrequency ?? "",
          responsibilities: job.responsibilities,
          requirements: job.requirements,
          website: "",
        })
        setLoadState("idle")
      } else {
        setLoadState("notFound")
      }
    }

    void loadJob()
    return () => {
      cancelled = true
    }
  }, [jobId])

  // One field at a time; editing a field clears its error
  function setField(key: keyof JobFormValues, value: string | boolean) {
    setValues((current) => ({ ...current, [key]: value }))
    setFieldErrors((current) => {
      if (current[key as FieldKey] === undefined) return current
      const next = { ...current }
      delete next[key as FieldKey]
      return next
    })
  }

  // Remote jobs do not need a location
  function setRemote(checked: boolean) {
    setValues((current) => ({ ...current, isRemote: checked }))
    setFieldErrors((current) => {
      if (current.location === undefined) return current
      const next = { ...current }
      delete next.location
      return next
    })
  }

  // Shared failure path: generic message, form data kept
  function failWith(message: string) {
    setFormError(message)
    setState("idle")
    setPublishing(false)
  }

  async function submitJob(
    path: string,
    method: string,
    payload: JobPayload,
    retried: boolean
  ) {
    const { status, data } = await apiRequest(path, { method, body: payload })

    if (status === 201 || status === 200) {
      setState("success")
      setPublishing(false)
      return
    }

    if (status === 400) {
      const mapped = mapServerErrors(data)
      if (mapped === null) {
        failWith(GENERIC_ERROR)
        return
      }
      setFieldErrors(mapped)
      setFormError(FIX_ERRORS)
      setState("idle")
      setPublishing(false)
      focusFirstError(mapped)
      return
    }

    if (status === 401) {
      if (retried) {
        setPublishing(false)
        router.push("/signin")
        return
      }
      await submitJob(path, method, payload, true)
      return
    }

    if (status === 403) {
      failWith("Your account can't post jobs.")
      return
    }

    if (status === 429) {
      failWith("Too many attempts. Please try again later.")
      return
    }

    if (status === 404) {
      // The job disappeared between load and save
      setState("idle")
      setPublishing(false)
      setLoadState("notFound")
      return
    }

    failWith(GENERIC_ERROR)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Success panel stays mounted; submitting again would duplicate the job
    if (state === "success" || state === "submitting") return
    if (editing && loadState !== "idle") return

    const nextErrors = validateJob(values)
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setFormError(FIX_ERRORS)
      focusFirstError(nextErrors)
      return
    }

    setFieldErrors({})
    setFormError(null)
    setState("submitting")
    setPublishing(true)

    if (editing) {
      await submitJob(`/api/jobs/${jobId}`, "PUT", buildPayload(values), false)
    } else {
      await submitJob("/api/jobs", "POST", buildPayload(values), false)
    }
  }

  function resetForm() {
    setValues(INITIAL_VALUES)
    setFieldErrors({})
    setFormError(null)
    setState("idle")
  }

  const errorMessages = Object.values(fieldErrors).filter(
    (message): message is string => message !== undefined
  )
  const alertMessage =
    formError ?? (errorMessages.length > 0 ? FIX_ERRORS : null)

  return (
    <form
      id={FORM_ID}
      onSubmit={handleSubmit}
      noValidate
      className="relative mt-6 space-y-4"
    >
      {alertMessage ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {alertMessage}
          {errorMessages.length > 0 ? (
            <ul className="mt-1.5 list-inside list-disc space-y-0.5">
              {errorMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {state === "success" ? (
        // Success panel replaces the fields; the form stays mounted to keep the header button bound
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">
            {editing ? "Job updated" : "Job posted"}
          </h2>
          {editing ? null : (
            <p className="mt-1 text-sm text-muted-foreground">
              Your listing is live and visible to candidates across our network.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            {editing ? (
              <Link
                href="/dashboard/recruiter/jobs"
                className={linkButtonClass}
              >
                Back to jobs
              </Link>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-11"
                  onClick={resetForm}
                >
                  Post another job
                </Button>
                <Link href="/dashboard/recruiter" className={linkButtonClass}>
                  Back to dashboard
                </Link>
                <Link
                  href="/dashboard/recruiter/jobs"
                  className={linkButtonClass}
                >
                  View my jobs
                </Link>
              </>
            )}
          </div>
        </div>
      ) : loadState === "loading" ? (
        <p role="status" className="text-sm text-muted-foreground">
          Loading job...
        </p>
      ) : loadState === "notFound" ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">
            Job not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This listing may have been removed.
          </p>
          <div className="mt-5">
            <Link href="/dashboard/recruiter/jobs" className={linkButtonClass}>
              Back to jobs
            </Link>
          </div>
        </div>
      ) : (
        <>
          <SectionCard index={1} title="Basic Information">
            <JobTextField
              id="title"
              label="Job Title"
              required
              placeholder="Frontend Developer"
              value={values.title}
              onChange={(value) => setField("title", value)}
              error={fieldErrors.title}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <JobTextField
                id="companyName"
                label="Company Name"
                required
                icon={BuildingIcon}
                placeholder="HirePulse Network"
                value={values.companyName}
                onChange={(value) => setField("companyName", value)}
                error={fieldErrors.companyName}
              />
              <JobSelectField
                id="category"
                label="Job Category"
                required
                placeholder="Select a category"
                value={values.category}
                onChange={(value) => setField("category", value)}
                error={fieldErrors.category}
                options={CATEGORY_OPTIONS}
              />
            </div>
            <JobTypeRadioGroup
              legend="Job Type"
              required
              value={values.jobType}
              onChange={(value) => setField("jobType", value)}
              error={fieldErrors.jobType}
              options={JOB_TYPES}
            />
          </SectionCard>

          <SectionCard index={2} title="Location, Compensation & Timeline">
            <RemoteSwitchField
              id="isRemote"
              label="Remote Work Allowed (isRemote)"
              description="Enable worldwide or distributed candidate applications"
              checked={values.isRemote}
              onChange={setRemote}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <JobTextField
                id="location"
                label="Job Location (location)"
                hint={values.isRemote ? undefined : "Required"}
                icon={MapPinIcon}
                placeholder="New York, USA"
                value={values.location}
                onChange={(value) => setField("location", value)}
                error={fieldErrors.location}
              />
              <JobTextField
                id="deadline"
                label="Application Deadline (deadline)"
                required
                type="date"
                icon={CalendarIcon}
                value={values.deadline}
                onChange={(value) => setField("deadline", value)}
                error={fieldErrors.deadline}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <JobTextField
                id="salaryMin"
                label="Min Salary / Rate"
                type="number"
                prefix="€"
                placeholder="25"
                value={values.salaryMin}
                onChange={(value) => setField("salaryMin", value)}
                error={fieldErrors.salaryMin}
              />
              <JobTextField
                id="salaryMax"
                label="Max Salary / Rate"
                type="number"
                prefix="€"
                placeholder="40"
                value={values.salaryMax}
                onChange={(value) => setField("salaryMax", value)}
                error={fieldErrors.salaryMax}
              />
              <JobSelectField
                id="salaryFrequency"
                label="Frequency"
                placeholder="Select frequency"
                value={values.salaryFrequency}
                onChange={(value) => setField("salaryFrequency", value)}
                error={fieldErrors.salaryFrequency}
                options={FREQUENCIES}
              />
            </div>
          </SectionCard>

          <SectionCard index={3} title="Responsibilities & Requirements">
            <JobTextareaField
              id="responsibilities"
              label="Key Responsibilities"
              required
              placeholder="Showcase your commitment to delivering exceptional user interfaces and digital experiences."
              value={values.responsibilities}
              onChange={(value) => setField("responsibilities", value)}
              error={fieldErrors.responsibilities}
            />
            <JobTextareaField
              id="requirements"
              label="Qualifications & Requirements"
              required
              placeholder="List the skills, experience and qualifications expected from applicants."
              value={values.requirements}
              onChange={(value) => setField("requirements", value)}
              error={fieldErrors.requirements}
            />
          </SectionCard>

          {/* Honeypot: off-screen, keyboard-invisible, bots fill it and get rejected server-side */}
          <div
            aria-hidden
            className="absolute top-0 left-[-9999px] h-px w-px overflow-hidden"
          >
            <label htmlFor="website" className="sr-only">
              Website
            </label>
            <input
              id="website"
              name="website"
              type="text"
              value={values.website}
              onChange={(event) => setField("website", event.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          <Button
            type="submit"
            form={FORM_ID}
            disabled={submitting}
            size="lg"
            className="h-11 w-full sm:hidden"
          >
            {submitting
              ? editing
                ? "Saving..."
                : "Publishing..."
              : editing
                ? "Save Changes"
                : "Publish Job"}
            <ArrowRightIcon
              data-icon="inline-end"
              aria-hidden
              className="size-4"
            />
          </Button>
        </>
      )}
    </form>
  )
}
