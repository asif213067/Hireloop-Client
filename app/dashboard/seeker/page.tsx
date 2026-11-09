import type { Metadata } from "next"

import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Seeker dashboard",
}

export default async function SeekerDashboardPage() {
  await requireRole("seeker")

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Seeker dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Dashboard content is coming next.
      </p>
    </div>
  )
}
