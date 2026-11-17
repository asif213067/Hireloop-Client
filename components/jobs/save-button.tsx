"use client"

import { useEffect, useState } from "react"
import { BookmarkIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { isRole, type Role } from "@/lib/roles"
import { fetchSavedJobIds, saveJob, unsaveJob } from "@/lib/saved-jobs-api"

const buttonClass =
  "flex size-11 shrink-0 items-center justify-center rounded-lg border outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"

const unsavedClass = "border-border bg-card text-foreground hover:bg-accent"
const savedClass = "border-foreground bg-foreground text-background"

type SaveButtonProps = {
  jobId: string
  initialSaved?: boolean
  onToggle?: (saved: boolean) => void
}

// Square bookmark toggle; a saved job stays visibly saved for later visits
export function SaveButton({ jobId, initialSaved, onToggle }: SaveButtonProps) {
  const { data: session, isPending } = authClient.useSession()
  const [loadedSaved, setLoadedSaved] = useState(false)
  const [override, setOverride] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)

  // No role in the user row counts as a plain seeker
  const role: Role | null = session
    ? isRole(session.user.role)
      ? session.user.role
      : "seeker"
    : null
  const isSeeker = role === "seeker"

  const saved = override ?? initialSaved ?? loadedSaved

  // Seekers without a known state load it once from the ids endpoint
  useEffect(() => {
    if (initialSaved !== undefined) return
    if (isPending || !session || !isSeeker) return
    let cancelled = false
    fetchSavedJobIds().then((ids) => {
      if (cancelled) return
      // Unknown ids count as not saved; the click still decides
      setLoadedSaved(ids !== null && ids.includes(jobId))
    })
    return () => {
      cancelled = true
    }
  }, [jobId, initialSaved, session, isPending, isSeeker])

  // Recruiters and admins get no save button at all
  if (isPending || (session && !isSeeker)) return null

  // Signed out: the square button links to sign-in
  if (!session) {
    return (
      <Link
        href={`/signin?next=/jobs/${jobId}`}
        aria-label="Sign in to save job"
        className={`${buttonClass} ${unsavedClass}`}
      >
        <BookmarkIcon aria-hidden className="size-4" />
      </Link>
    )
  }

  async function onToggleClick() {
    setBusy(true)
    try {
      if (saved) {
        await unsaveJob(jobId)
        setOverride(false)
        toast.success("Removed from saved jobs")
        // The page can drop the card as soon as the unsave succeeds
        onToggle?.(false)
      } else {
        await saveJob(jobId)
        setOverride(true)
        toast.success("Job saved")
        onToggle?.(true)
      }
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Could not update saved jobs. Please try again."
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onToggleClick}
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved jobs" : "Save job"}
      className={`${buttonClass} ${saved ? savedClass : unsavedClass}`}
    >
      <BookmarkIcon
        aria-hidden
        className={`size-4 ${saved ? "fill-current" : ""}`}
      />
    </button>
  )
}
