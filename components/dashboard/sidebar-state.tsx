"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

// Shared id so the topbar toggle can aria-controls the aside
export const SIDEBAR_ID = "dashboard-sidebar"

type SidebarState = {
  collapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarState | null>(null)

type SidebarProviderProps = {
  /** First paint matches the server-rendered cookie to avoid flicker */
  defaultCollapsed: boolean
  children: ReactNode
}

// Desktop sidebar collapse state, mirrored into a long-lived cookie
export function SidebarProvider({
  defaultCollapsed,
  children,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  useEffect(() => {
    document.cookie = `sidebar-collapsed=${collapsed ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`
  }, [collapsed])

  const toggle = useCallback(() => {
    setCollapsed((current) => !current)
  }, [])

  const value = useMemo(() => ({ collapsed, toggle }), [collapsed, toggle])

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarState {
  const state = useContext(SidebarContext)

  if (!state) {
    throw new Error("useSidebar must be used inside SidebarProvider")
  }

  return state
}
