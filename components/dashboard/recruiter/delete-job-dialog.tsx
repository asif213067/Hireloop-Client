"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiRequest } from "@/lib/api"
import type { JobResponse } from "@/lib/jobs"

type DeleteJobDialogProps = {
  job: JobResponse
  onClose: () => void
  onDeleted: (id: string) => void
}

// Confirmation dialog for one job; stays open and shows an error if the delete fails
export function DeleteJobDialog({
  job,
  onClose,
  onDeleted,
}: DeleteJobDialogProps) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Escape, overlay click and the close button do nothing while deleting
  function handleOpenChange(open: boolean) {
    if (!open && !pending) onClose()
  }

  async function handleDelete() {
    setPending(true)
    setError(null)

    const { status } = await apiRequest(`/api/jobs/${job.id}`, {
      method: "DELETE",
    })

    // The parent removes the job and unmounts this dialog
    if (status === 204) {
      onDeleted(job.id)
      return
    }

    setError("Could not delete the job. Please try again.")
    setPending(false)
  }

  const applications =
    job.applicantsCount === 1 ? "application" : "applications"

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this job?</DialogTitle>
          <DialogDescription>
            &quot;{job.title}&quot; will be permanently removed. This can&apos;t
            be undone.
            {job.applicantsCount > 0
              ? ` Its ${job.applicantsCount} ${applications} will be removed too.`
              : ""}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11"
            disabled={pending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            className="h-11"
            disabled={pending}
            onClick={handleDelete}
          >
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
