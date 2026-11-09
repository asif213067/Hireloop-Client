import type { Metadata } from "next"

import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your HireLoop account.",
  robots: { index: false, follow: true },
}

export default function SignInPage() {
  return <SignInForm />
}
