import type { Metadata } from "next"

import { SettingsContent } from "@/components/dashboard/settings/settings-content"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
}

// Recruiter settings; other roles are redirected by requireRole
export default async function Page() {
  const session = await requireRole("recruiter")

  return (
    <SettingsContent
      role="recruiter"
      name={session.user.name}
      email={session.user.email}
    />
  )
}
