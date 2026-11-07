"use client"

import Image from "next/image"

import { cn } from "cn"

/**
 * "Continue with Google" button shared by the Sign In and Sign Up forms.
 * Uses the Google icon from /public/images/logos.
 *
 * TODO: wire the click to better-auth social sign-in:
 * authClient.signIn.social({ provider: "google" })
 */
export function ContinueWithGoogle({ className }: { className?: string }) {
  function handleClick() {
    // Placeholder until auth integration
    console.log("[auth] Google sign-in clicked (integration pending)")
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border border-white/15 bg-white/[0.04] text-sm font-medium text-white transition-colors outline-none hover:bg-white/10 focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Image
        src="/images/logos/google.png"
        alt=""
        aria-hidden
        width={16}
        height={16}
        className="size-4"
      />
      Continue with Google
    </button>
  )
}
