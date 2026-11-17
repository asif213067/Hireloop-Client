import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
  iconClassName?: string
}

// Small stat card: label and icon on top, big number below
export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon
          aria-hidden
          className={cn("size-4 text-muted-foreground", iconClassName)}
        />
      </div>
      <p className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  )
}
