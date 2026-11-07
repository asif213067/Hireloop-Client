"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthCard, OrDivider } from "@/components/auth/auth-card"
import { AuthField, PasswordField } from "@/components/auth/auth-field"
import { GoogleButton } from "@/components/auth/google-button"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })

    if (signInError) {
      setPending(false)
      setError(signInError.message ?? "Couldn't sign you in. Please try again.")
      return
    }

    // Refresh so server components pick up the new session cookie
    router.push("/")
    router.refresh()
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue your job search."
      footer={
        <>
          New to HireLoop?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" onError={setError} />

      <OrDivider />

      {/* Email + password sign in */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />
        <PasswordField
          id="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
        />

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 w-full"
        >
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  )
}
