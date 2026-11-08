"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type SignOutButtonProps = {
  className?: string
}

// Ends the session and lands the user back on the home page
export function SignOutButton({ className }: SignOutButtonProps) {
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
