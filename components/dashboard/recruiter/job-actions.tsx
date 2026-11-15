import { PencilIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"

import type { JobResponse } from "@/lib/jobs"
import { cn } from "@/lib/utils"

// Shared icon button look: bigger on touch screens, compact on the table
const iconButtonClass =
  "inline-flex size-11 items-center justify-center rounded-lg bg-secondary text-muted-foreground outline-none transition-colors focus-visible:ring-3 xl:size-9"

// Icon-only Update link and Delete button, used by the table and the cards
export function JobActions({
  job,
  onDelete,
}: {
  job: JobResponse
  onDelete: (job: JobResponse) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/dashboard/recruiter/jobs/${job.id}/edit`}
        aria-label={`Update ${job.title}`}
        title="Update"
        className={cn(
          iconButtonClass,
          "hover:bg-primary/15 hover:text-primary focus-visible:ring-ring/50"
        )}
      >
        <PencilIcon aria-hidden className="size-4" />
      </Link>
      <button
        type="button"
        onClick={() => onDelete(job)}
        aria-label={`Delete ${job.title}`}
        title="Delete"
        className={cn(
          iconButtonClass,
          "hover:bg-destructive/15 hover:text-destructive focus-visible:ring-destructive/40"
        )}
      >
        <Trash2Icon aria-hidden className="size-4" />
      </button>
    </div>
  )
}
