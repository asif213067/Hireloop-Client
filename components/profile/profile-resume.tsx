"use client"

import { ExternalLinkIcon, FileTextIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import type { PublicSeekerResume } from "@/lib/public-profiles"

type ProfileResumeProps = {
  resume: PublicSeekerResume | null
  variant?: "card" | "button"
}

export function ProfileResume({
  resume,
  variant = "card",
}: ProfileResumeProps) {
  function handleViewResume() {
    if (!resume?.url) {
      toast.info("Resume not uploaded yet.")
      return
    }
    window.open(resume.url, "_blank", "noopener,noreferrer")
  }

  if (variant === "button") {
    return (
      <Button
        type="button"
        onClick={handleViewResume}
        className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"
      >
        <FileTextIcon aria-hidden className="mr-1.5 size-4" />
        View Resume
        {resume?.url && (
          <ExternalLinkIcon aria-hidden className="ml-1.5 size-3.5" />
        )}
      </Button>
    )
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">Resume</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {resume?.url
          ? resume.fileName
          : "Candidate has not uploaded a resume yet."}
      </p>
      <Button
        type="button"
        variant={resume?.url ? "default" : "outline"}
        onClick={handleViewResume}
        className="mt-4 h-10 w-full rounded-lg text-sm font-medium"
      >
        <FileTextIcon aria-hidden className="mr-1.5 size-4" />
        View Resume
      </Button>
    </section>
  )
}
