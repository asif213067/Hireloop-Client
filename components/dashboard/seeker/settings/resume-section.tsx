"use client"

import { DownloadIcon, FileTextIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function ResumeSection() {
  function handleResumeAction() {
    toast.info("Resume management will be available soon.")
  }

  return (
    <aside className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Resume</h2>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Upload your most recent resume to enable one-click applications.
      </p>

      {/* Dashed Resume Preview & Dropzone Area */}
      <div className="mt-5 rounded-xl border border-dashed border-border bg-background/40 p-5 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-secondary">
          <FileTextIcon aria-hidden className="size-5 text-foreground" />
        </div>

        <p className="mt-3 truncate text-sm font-medium text-foreground">
          Alex_Morgan_Resume.pdf
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          1.2 MB · Uploaded Nov 20, 2026
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResumeAction}
            className="h-9 rounded-lg border-border bg-background/60 text-xs font-medium"
          >
            Replace Resume
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResumeAction}
            className="h-9 rounded-lg border-border bg-background/60 text-xs font-medium text-destructive hover:text-destructive"
          >
            Remove Resume
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResumeAction}
          className="mt-2 h-8 w-full text-xs text-muted-foreground hover:text-foreground"
        >
          <DownloadIcon aria-hidden className="mr-1.5 size-3.5" />
          View / Download Resume
        </Button>
      </div>

      {/* Upload Action + PDF-only Notice */}
      <div className="mt-4 space-y-2.5">
        <Button
          type="button"
          onClick={handleResumeAction}
          className="h-10 w-full rounded-lg bg-white text-sm font-semibold text-black hover:bg-white/90"
        >
          <UploadIcon aria-hidden className="mr-1.5 size-4" />
          Upload Resume
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Only PDF files are accepted (max 5MB).
        </p>
      </div>
    </aside>
  )
}
