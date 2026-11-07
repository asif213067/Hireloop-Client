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
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
] as const

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function DesktopNav() {
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
      </div>
    </div>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function Navbar() {
  return (
    <div className="pointer-events-none sticky top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <header className="pointer-events-auto mx-auto flex h-14 max-w-6xl items-center justify-between rounded-xl border border-border bg-card/70 px-4 shadow-lg shadow-black/30 backdrop-blur-xl">
        <Logo priority />
        <DesktopNav />
        <MobileNav />
      </header>
    </div>
  )
}
