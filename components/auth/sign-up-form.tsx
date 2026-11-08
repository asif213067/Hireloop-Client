"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { AuthCard, OrDivider } from "@/components/auth/auth-card"
import { AuthField, PasswordField } from "@/components/auth/auth-field"
import { GoogleButton } from "@/components/auth/google-button"
import { RolePicker } from "@/components/auth/role-picker"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import type { PublicSignupRole } from "@/lib/roles"

import { PasswordRules } from "@/components/auth/password-rules"
import { isPasswordValid } from "@/lib/password-policy"

export function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<PublicSignupRole>("seeker")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!isPasswordValid(password)) {
      setError("Please meet all the password requirements.")
      return
    }

    setPending(true)

    // Creates the account and signs the user in
    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email,
      password,
      role,
    })

    if (signUpError) {
      setPending(false)
      setError(signUpError.message ?? "Something went wrong. Please try again.")
      return
    }

    // Refresh so server components pick up the new session cookie
    router.push("/")
    router.refresh()
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join HireLoop and start applying in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      {/* Fastest path first: one-click Google */}
      <GoogleButton label="Sign up with Google" onError={setError} />

      <OrDivider />

      {/* Email + password registration */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="name"
          label="Full name"
          autoComplete="name"
          placeholder="Your full name"
          value={name}
          onChange={setName}
        />

        {/* Google sign-ups can't carry a role, so ask here instead */}
        <RolePicker value={role} onChange={setRole} disabled={pending} />

        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />
        <div>
          <PasswordField
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={setPassword}
            describedBy="password-rules"
          />
          <PasswordRules id="password-rules" password={password} />
        </div>

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
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthCard>
  )
}
