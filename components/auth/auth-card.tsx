import type { ReactNode } from "react"

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

// Card container: heading, form area and a footer link
export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-8">{children}</div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
    </div>
  )
}

// "or" divider between Google and the email form
export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs tracking-wider text-muted-foreground uppercase">
        or
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
