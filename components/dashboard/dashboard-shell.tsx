import type { ReactNode } from "react"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { SidebarProvider } from "@/components/dashboard/sidebar-state"
import type { Role } from "@/lib/roles"

type DashboardUserProfile = {
  name: string
  image?: string | null
  role?: string | null
}

type DashboardShellProps = {
  role: Role
  defaultCollapsed: boolean
  user: DashboardUserProfile
  children: ReactNode
}

// Shared frame: dark canvas with a fixed sidebar and a rounded main panel
export function DashboardShell({
  role,
  defaultCollapsed,
  user,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      <div className="min-h-dvh bg-sidebar p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          <DashboardSidebar role={role} user={user} />
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl border border-border bg-background">
            <DashboardTopbar role={role} user={user} />
            <main id="main" className="flex-1 p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
