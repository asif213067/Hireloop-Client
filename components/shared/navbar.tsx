"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/shared/logo"
import { UserAvatar } from "@/components/shared/user-avatar"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { authClient } from "@/lib/auth-client"
import { getProfileHref } from "@/lib/roles"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
] as const

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

type NavSession = {
  user: {
    name: string
    image?: string | null
    role?: string | null
  } | null
  isPending: boolean
}

// 44px tap target around the 40px avatar
const avatarLinkClass =
  "inline-flex size-11 items-center justify-center rounded-full outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"

function DesktopNav({ user, isPending }: NavSession) {
  const pathname = usePathname()

  return (
    <div className="hidden items-center md:flex">
      <nav className="flex items-center gap-1" aria-label="Main">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(pathname, link.href) ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-sm text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Separator orientation="vertical" className="mx-3 h-6" />
      <div className="flex items-center gap-1.5">
        {isPending ? (
          // Placeholder while the session loads so the header doesn't jump
          <div
            aria-hidden
            className="mr-1 size-10 animate-pulse rounded-full bg-muted"
          />
        ) : user ? (
          <>
            <Link
              href={getProfileHref(user.role)}
              aria-label="Open your profile"
              className={avatarLinkClass}
            >
              <UserAvatar name={user.name} image={user.image} />
            </Link>
            <SignOutButton />
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-sm font-semibold text-primary hover:text-primary/80"
              )}
            >
              Sign In
            </Link>
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

function MobileNav({ user, isPending }: NavSession) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-1 md:hidden">
      {user ? (
        <Link
          href={getProfileHref(user.role)}
          aria-label="Open your profile"
          className={avatarLinkClass}
        >
          <UserAvatar name={user.name} image={user.image} />
        </Link>
      ) : isPending ? (
        <div aria-hidden className="size-10 animate-pulse rounded-full bg-muted" />
      ) : null}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="size-11 md:hidden"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Logo imageClassName="h-6" />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-11 w-full justify-start text-base text-muted-foreground aria-[current=page]:bg-accent aria-[current=page]:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <SheetFooter className="border-t">
            {user ? (
              <SignOutButton className="h-11 w-full" />
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-11 w-full"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
                >
                  Get Started
                </Link>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user ?? null

  return (
    <div className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <header className="pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl border border-border bg-card/70 px-4 shadow-lg shadow-black/30 backdrop-blur-xl">
        <Logo priority />
        <DesktopNav user={user} isPending={isPending} />
        <MobileNav user={user} isPending={isPending} />
      </header>
    </div>
  )
}
