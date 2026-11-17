import type { Metadata } from "next"

import { SeekerOverview } from "@/components/dashboard/seeker/seeker-overview"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Seeker dashboard",
  robots: { index: false, follow: false },
}

export default async function SeekerDashboardPage() {
  await requireRole("seeker")

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Seeker dashboard</h1>
      <SeekerOverview />
    </div>
  )
}
