"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircleIcon, LogOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  footerRowClasses,
  footerTileClasses,
} from "@/components/dashboard/footer-row"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type SignOutButtonProps = {
  className?: string
  compact?: boolean
  variant?: "default" | "sidebar"
  collapsed?: boolean
  sheet?: boolean
}

// Ends the session and lands the user back on the home page
export function SignOutButton({
  className,
  compact = false,
  variant = "default",
  collapsed = false,
  sheet = false,
}: SignOutButtonProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleClick() {
    setPending(true)

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
          router.refresh()
        },
      },
    })

    setPending(false)
  }

  // Sidebar footer row: icon tile + label, icon-only when collapsed
  if (variant === "sidebar") {
    const label = pending ? "Signing out..." : "Sign out"

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={collapsed ? "Sign out" : undefined}
        title={collapsed ? "Sign out" : undefined}
        className={cn(
          footerRowClasses({ tone: "danger", collapsed, sheet }),
          "disabled:pointer-events-none disabled:opacity-60",
          className
        )}
      >
        <span className={footerTileClasses("danger")}>
          {pending ? (
            <LoaderCircleIcon aria-hidden className="size-4 animate-spin" />
          ) : (
            <LogOutIcon
              aria-hidden
              className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none"
            />
          )}
        </span>
        {collapsed ? (
          <span className="sr-only">{label}</span>
        ) : (
          <span className="truncate">{label}</span>
        )}
      </button>
    )
  }

  // Icon-only round variant (kept for any existing callers)
  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        disabled={pending}
        aria-label="Sign out"
        className={className}
      >
        <LogOutIcon />
      </Button>
    )
  }

  // Default text button used by the public navbar
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleClick}
      disabled={pending}
      className={className}
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  )
}
