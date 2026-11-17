import type { Metadata } from "next"

import { SavedJobsView } from "@/components/dashboard/seeker/saved-jobs-view"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Saved Jobs",
  robots: { index: false, follow: false },
}

// Saved jobs for seekers; other roles are redirected by requireRole
export default async function Page() {
  await requireRole("seeker")

  return <SavedJobsView />
}
