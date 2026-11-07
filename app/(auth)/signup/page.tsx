import type { Metadata } from "next"

import { SignUpForm } from "@/components/auth/sign-up-form"

// Auth pages have no search value, so they are kept out of Google
export const metadata: Metadata = {
  title: "Create your account",
  description: "Create a HireLoop account to search and apply for jobs.",
  robots: { index: false, follow: true },
}

export default function SignUpPage() {
  return <SignUpForm />
}
