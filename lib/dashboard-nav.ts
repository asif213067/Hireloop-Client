import type { LucideIcon } from "lucide-react"
import {
  BellIcon,
  BriefcaseIcon,
  Building2Icon,
  BookmarkIcon,
  CircleHelpIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MailIcon,
  ScrollTextIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { getDashboardHref, type Role } from "@/lib/roles"

type DashboardNavItem = {
  label: string
  href: string
  icon: LucideIcon
  enabled: boolean
}

// Top bar icon button; `dot` marks something new
type TopbarAction = {
  label: string
  icon: LucideIcon
  dot?: "destructive" | "success"
}

type DashboardNav = {
  portalLabel: string
  searchPlaceholder: string
  topbarActions: TopbarAction[]
  items: DashboardNavItem[]
}

// Role-based top bar actions: admin has no messages, others have both
function getTopbarActions(role: Role): TopbarAction[] {
  if (role === "admin") {
    return [
      { label: "Notifications", icon: BellIcon, dot: "destructive" },
      { label: "Help", icon: CircleHelpIcon },
    ]
  }

  if (role === "recruiter") {
    return [
      { label: "Messages", icon: MailIcon },
      { label: "Notifications", icon: BellIcon },
    ]
  }

  return [
    { label: "Messages", icon: MailIcon, dot: "destructive" },
    { label: "Notifications", icon: BellIcon, dot: "success" },
  ]
}

// Role-based dashboard outline until each section is built
export function getDashboardNav(role: Role): DashboardNav {
  const home = getDashboardHref(role)

  return {
    portalLabel:
      role === "admin"
        ? "Admin Console"
        : role === "recruiter"
          ? "Recruiter Portal"
          : "Seeker Portal",
    searchPlaceholder:
      role === "admin"
        ? "Global search..."
        : role === "recruiter"
          ? "Search candidates or jobs..."
          : "Search for opportunities...",
    topbarActions: getTopbarActions(role),
    items: [
      {
        label: "Dashboard",
        href: home,
        icon: LayoutDashboardIcon,
        enabled: true,
      },
      ...(role === "admin"
        ? [
            {
              label: "Users",
              href: "/dashboard/admin/users",
              icon: UsersIcon,
              enabled: false,
            },
            {
              label: "Companies",
              href: "/dashboard/admin/companies",
              icon: Building2Icon,
              enabled: false,
            },
            {
              label: "Jobs",
              href: "/dashboard/admin/jobs",
              icon: BriefcaseIcon,
              enabled: false,
            },
            {
              label: "Payments",
              href: "/dashboard/admin/payments",
              icon: CreditCardIcon,
              enabled: false,
            },
          ]
        : []),
      ...(role === "recruiter"
        ? [
            {
              label: "Manage Jobs",
              href: "/dashboard/recruiter/jobs",
              icon: BriefcaseIcon,
              enabled: false,
            },
            {
              label: "Applications",
              href: "/dashboard/recruiter/applications",
              icon: ScrollTextIcon,
              enabled: false,
            },
          ]
        : []),
      ...(role === "seeker"
        ? [
            {
              label: "Jobs",
              href: "/dashboard/seeker/jobs",
              icon: BriefcaseIcon,
              enabled: false,
            },
            {
              label: "Saved Jobs",
              href: "/dashboard/seeker/saved-jobs",
              icon: BookmarkIcon,
              enabled: false,
            },
            {
              label: "Applications",
              href: "/dashboard/seeker/applications",
              icon: FileTextIcon,
              enabled: false,
            },
            {
              label: "Billing",
              href: "/dashboard/seeker/billing",
              icon: CreditCardIcon,
              enabled: false,
            },
          ]
        : []),
      {
        label: "Settings",
        href: `/dashboard/${role}/settings`,
        icon: SettingsIcon,
        enabled: false,
      },
    ],
  }
}
