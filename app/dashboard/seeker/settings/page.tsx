import type { Metadata } from "next"

import { SettingsContent } from "@/components/dashboard/settings/settings-content"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
}

// Seeker settings; other roles are redirected by requireRole
export default async function Page() {
  const session = await requireRole("seeker")

  return (
    <SettingsContent
      role="seeker"
      name={session.user.name}
      email={session.user.email}
    />
  )
}
