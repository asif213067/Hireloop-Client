"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HouseIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"
import { UserAvatar } from "@/components/shared/user-avatar"
import { SignOutButton } from "@/components/auth/sign-out-button"
import {
  footerRowClasses,
  footerTileClasses,
} from "@/components/dashboard/footer-row"
import { getDashboardNav } from "@/lib/dashboard-nav"
import type { Role } from "@/lib/roles"
import { SIDEBAR_ID, useSidebar } from "@/components/dashboard/sidebar-state"
import { cn } from "@/lib/utils"

type SidebarUser = {
  name: string
  image?: string | null
  role?: string | null
}

type SidebarContentProps = {
  role: Role
  user: SidebarUser
  /** Sheet variant: taller rows and sign-out for touch targets */
  sheet?: boolean
  /** Icon-only reduced layout, only used by the desktop sidebar */
  collapsed?: boolean
  onNavigate?: () => void
}

// Shared identity card: avatar, name and role label
function UserCard({ user, role }: { user: SidebarUser; role: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3 px-1 py-1">
      <UserAvatar
        name={user.name}
        image={user.image}
        className="size-9 shrink-0"
      />
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground capitalize">
          {role ?? "seeker"}
        </p>
      </div>
    </div>
  )
}

type SidebarHeaderProps = {
  portalLabel: string
  collapsed?: boolean
}

// Collapsed shows a letter mark instead of image-based wordmark
function SidebarHeader({ portalLabel, collapsed }: SidebarHeaderProps) {
  if (collapsed) {
    return (
      <div className="flex justify-center border-b border-sidebar-border p-3">
        <Link
          href="/"
          aria-label="HireLoop – home"
          className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          H
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 border-b border-sidebar-border p-3">
      <Logo />
      <p className="px-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
        {portalLabel}
      </p>
    </div>
  )
}

type FooterRowProps = {
  collapsed?: boolean
  sheet?: boolean
  onNavigate?: () => void
}

// Footer row: back to the public homepage (same tab)
function BackToSiteLink({ collapsed, sheet, onNavigate }: FooterRowProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label={collapsed ? "Back to site" : undefined}
      title={collapsed ? "Back to site" : undefined}
      className={footerRowClasses({ tone: "neutral", collapsed, sheet })}
    >
      <span className={footerTileClasses("neutral")}>
        <HouseIcon aria-hidden className="size-4" />
      </span>
      {collapsed ? (
        <span className="sr-only">Back to site</span>
      ) : (
        <span className="truncate">Back to site</span>
      )}
    </Link>
  )
}

type SidebarFooterProps = FooterRowProps & {
  user: SidebarUser
}

// Footer: identity, then Back to site, then Sign out at the very bottom
function SidebarFooter({
  user,
  collapsed,
  sheet,
  onNavigate,
}: SidebarFooterProps) {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-1 border-t border-sidebar-border p-3">
        <span title={user.name} className="mb-1 grid place-items-center">
          <span className="sr-only">{user.name}</span>
          <UserAvatar name={user.name} image={user.image} />
        </span>
        <span aria-hidden className="mb-1 h-px w-6 bg-sidebar-border" />
        <BackToSiteLink collapsed />
        <SignOutButton variant="sidebar" collapsed />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 border-t border-sidebar-border p-3">
      <UserCard user={user} role={user.role ?? null} />
      <div aria-hidden className="my-1 h-px bg-sidebar-border" />
      <BackToSiteLink sheet={sheet} onNavigate={onNavigate} />
      <SignOutButton variant="sidebar" sheet={sheet} />
    </div>
  )
}

export function SidebarContent({
  role,
  user,
  sheet = false,
  collapsed = false,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname()
  const nav = getDashboardNav(role)

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader portalLabel={nav.portalLabel} collapsed={collapsed} />
      <nav
        aria-label="Dashboard"
        className="flex-1 overflow-y-auto overscroll-contain p-3"
      >
        <ul className="flex flex-col gap-1">
          {nav.items.map((item) => {
            const active = pathname === item.href

            if (!item.enabled) {
              // Not a link until the section exists: announced as disabled
              return (
                <li key={item.href}>
                  <span
                    aria-disabled="true"
                    role="link"
                    title={collapsed ? `${item.label} (soon)` : undefined}
                    className={cn(
                      "flex h-10 cursor-not-allowed items-center gap-3 text-sm font-medium text-muted-foreground/70",
                      collapsed
                        ? "justify-center px-0"
                        : "justify-start pr-2 pl-3",
                      sheet && "h-11"
                    )}
                  >
                    <item.icon aria-hidden className="size-4" />
                    {collapsed ? (
                      <span className="sr-only">{item.label}</span>
                    ) : (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!collapsed && (
                      <span className="ml-auto text-xs font-medium tracking-wider text-muted-foreground/70 uppercase">
                        Soon
                      </span>
                    )}
                  </span>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "relative h-10 w-full text-muted-foreground hover:bg-accent/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                    collapsed
                      ? "justify-center px-0"
                      : "justify-start gap-3 px-3",
                    sheet && "h-11",
                    active && "bg-accent text-foreground hover:bg-accent"
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-primary"
                    />
                  )}
                  <item.icon aria-hidden className="size-4" />
                  {collapsed ? (
                    <span className="sr-only">{item.label}</span>
                  ) : (
                    item.label
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <SidebarFooter
        user={user}
        collapsed={collapsed}
        sheet={sheet}
        onNavigate={onNavigate}
      />
    </div>
  )
}

// Fixed sidebar column, visible from lg onward, with a width transition
export function DashboardSidebar({
  role,
  user,
}: {
  role: Role
  user: SidebarUser
}) {
  const { collapsed } = useSidebar()

  return (
    <aside
      id={SIDEBAR_ID}
      aria-label="Dashboard"
      className={cn(
        "hidden w-56 shrink-0 overflow-hidden lg:sticky lg:top-4 lg:block lg:h-[calc(100dvh-2rem)] lg:transition-[width] lg:duration-200 lg:ease-out lg:motion-reduce:transition-none",
        collapsed ? "lg:w-18" : "lg:w-56"
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarContent role={role} user={user} collapsed={collapsed} />
      </div>
    </aside>
  )
}