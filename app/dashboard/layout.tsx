import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import type { Role } from "@/lib/roles"
import { isRole } from "@/lib/roles"
import { getSession } from "@/lib/session"

// The dashboard is private: never indexed
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  if (!session) redirect("/signin")

  // Persisted sidebar choice decides the first paint
  const cookieStore = await cookies()
  const defaultCollapsed = cookieStore.get("sidebar-collapsed")?.value === "1"

  // A user row without a role counts as a plain seeker
  const role: Role = isRole(session.user.role) ? session.user.role : "seeker"

  return (
    <DashboardShell
      role={role}
      defaultCollapsed={defaultCollapsed}
      user={{
        name: session.user.name,
        image: session.user.image,
        role: session.user.role ?? null,
      }}
    >
      {children}
    </DashboardShell>
  )
}
