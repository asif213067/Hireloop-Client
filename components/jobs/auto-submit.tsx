"use client"

import type { ReactNode } from "react"

// Submits the closest form whenever an input inside changes
export function AutoSubmit({ children }: { children: ReactNode }) {
  return (
    <div
      onChange={(event) => event.currentTarget.closest("form")?.requestSubmit()}
    >
      {children}
    </div>
  )
}
