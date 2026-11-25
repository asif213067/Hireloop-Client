import type { Metadata } from "next"

import { RecruiterApplicationsView } from "@/components/dashboard/recruiter/applications-view"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
}

export default async function RecruiterApplicationsPage() {
  await requireRole("recruiter")

  return <RecruiterApplicationsView />
}
