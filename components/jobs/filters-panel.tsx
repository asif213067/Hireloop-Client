"use client"

import { ListFilterIcon } from "lucide-react"
import { useState, type ReactNode } from "react"

import { cn } from "cn"

type FiltersPanelProps = {
  children: ReactNode
  activeCount: number
}

// Collapsible filters on touch screens; always open from lg
export function FiltersPanel({ children, activeCount }: FiltersPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground outline-none",
          "focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
        )}
      >
        <ListFilterIcon aria-hidden className="size-4" />
        Filters
        {activeCount > 0 ? (
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {activeCount}
          </span>
        ) : null}
      </button>
      {/* Inputs stay mounted so the surrounding form always submits them */}
      <div className={cn(open ? "block" : "hidden", "mt-4 lg:mt-0 lg:block")}>
        {children}
      </div>
    </div>
  )
}
