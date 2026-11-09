"use client"

import { useState } from "react"
import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { SidebarContent } from "@/components/dashboard/dashboard-sidebar"
import { SIDEBAR_ID, useSidebar } from "@/components/dashboard/sidebar-state"
import { getDashboardNav } from "@/lib/dashboard-nav"
import type { Role } from "@/lib/roles"
import { cn } from "@/lib/utils"

type DashboardTopbarProps = {
  role: Role
  user: {
    name: string
    image?: string | null
    role?: string | null
  }
}

// Top bar of the main panel: collapse, menu, search and role actions
export function DashboardTopbar({ role, user }: DashboardTopbarProps) {
  const [open, setOpen] = useState(false)
  const nav = getDashboardNav(role)
  const { collapsed, toggle } = useSidebar()

  const ToggleIcon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 rounded-t-2xl border-b border-border bg-background/95 px-3 backdrop-blur-sm sm:gap-3 sm:px-4">
      {/* Desktop-only width toggle for the fixed sidebar */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        aria-controls={SIDEBAR_ID}
        className="hidden size-11 lg:inline-flex"
      >
        <ToggleIcon />
      </Button>

      {/* Sheet navigation replaces the fixed sidebar below lg */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open dashboard menu"
              className="size-11 lg:hidden"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 max-w-[85vw]">
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <SidebarContent
            role={role}
            user={user}
            sheet
            collapsed={false}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Search is decorative until the sections exist */}
      <Input
        type="search"
        placeholder={nav.searchPlaceholder}
        aria-label="Search"
        disabled
        className="h-9 max-w-md min-w-0 flex-1"
      />

      {/* Role actions: visual-only until messages and notifications exist */}
      <div className="ml-auto flex items-center gap-1">
        {nav.topbarActions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant="ghost"
            size="icon"
            disabled
            aria-label={action.dot ? `${action.label} (new)` : action.label}
            className="relative size-11"
          >
            <action.icon aria-hidden className="size-4" />
            {action.dot ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-2.5 right-2.5 size-2 rounded-full ring-2 ring-background",
                  action.dot === "success" ? "bg-success" : "bg-destructive"
                )}
              />
            ) : null}
          </Button>
        ))}
      </div>
    </header>
  )
}
