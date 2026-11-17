"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import {
  applyToJob,
  checkApplied,
  type ApplyResult,
} from "@/lib/applications-api"

const buttonClass =
  "inline-flex w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground outline-none hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"

export function ApplyButton({
  jobId,
  jobTitle,
  className = "",
}: {
  jobId: string
  jobTitle: string
  className?: string
}) {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()
  const [applied, setApplied] = useState(false)
  const [sending, setSending] = useState(false)

  // Only these two roles are blocked; any other role the server decides
  const blocked =
    session?.user.role === "recruiter" || session?.user.role === "admin"

  // Ask the server once on mount whether this job is already applied
  useEffect(() => {
    if (!session || blocked) return
    let cancelled = false
    checkApplied(jobId).then((value) => {
      // null means the check failed; the click will still tell the truth
      if (!cancelled && value === true) setApplied(true)
    })
    return () => {
      cancelled = true
    }
  }, [jobId, session, blocked])

  function handleResult(result: ApplyResult) {
    switch (result) {
      // Success states move the button to Applied
      case "applied":
        setApplied(true)
        toast.success("Application sent", { description: jobTitle })
        return
      case "already-applied":
        setApplied(true)
        toast("You already applied to this job.")
        return
      case "job-closed":
        toast.error("This job is no longer open.")
        return
      case "not-seeker":
        toast.error("Only job seekers can apply.")
        return
      case "not-signed-in":
        toast.error("Please sign in to apply.")
        router.push("/signin")
        return
      case "error":
        toast.error("Could not apply right now. Please try again.")
    }
  }

  async function onApply() {
    // Blocked roles never reach the server
    if (blocked) {
      toast.error("Only job seekers can apply.")
      return
    }
    setSending(true)
    const result = await applyToJob(jobId)
    setSending(false)
    handleResult(result)
  }

  // Session still loading: same size, no state flashes
  if (isPending) {
    return (
      <button type="button" disabled className={`${buttonClass} ${className}`}>
        Apply Now
      </button>
    )
  }

  // Not signed in: a real link styled like the button
  if (!session) {
    return (
      <Link href="/signin" className={`${buttonClass} ${className}`}>
        Sign in to apply
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onApply}
      disabled={sending || applied}
      aria-busy={sending}
      className={`${buttonClass} ${className}`}
    >
      {sending ? "Applying..." : applied ? "Applied" : "Apply Now"}
    </button>
  )
}
