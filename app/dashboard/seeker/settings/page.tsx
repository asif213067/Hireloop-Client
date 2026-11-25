import type { Metadata } from "next"

import { SeekerSettingsView } from "@/components/dashboard/seeker/settings/seeker-settings-view"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
}

// Seeker settings; other roles are redirected by requireRole
export default async function Page() {
  const session = await requireRole("seeker")

  return (
    <SeekerSettingsView
      name={session.user.name}
      email={session.user.email}
      image={session.user.image}
    />
  )
}
