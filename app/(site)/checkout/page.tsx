import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, AlertCircle } from "lucide-react"

import { getSession } from "@/lib/session"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = {
  title: "Subscription & Pricing Plans",
  description:
    "Upgrade to Hireloop Pro for unlimited job applications, unlimited job postings, and premium career tools.",
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string; error?: string; interval?: string }>
}) {
  const { canceled, error, interval } = await searchParams
  const session = await getSession()
  const user = session?.user ?? null
  const isSubscribed = (user as unknown as { subscription?: { plan?: string; status?: string } })?.subscription?.plan === "pro"

  const initialInterval = interval === "yearly" ? "yearly" : "monthly"

  return (
    <div className="min-h-screen bg-[#08080a] text-white">
      {/* Header bar */}
      <header className="mx-auto flex h-20 w-full max-w-5xl items-center px-4">
        <Link
          href="/"
          aria-label="Back to home"
          className="mr-6 text-[#a1a1aa] transition-colors hover:text-white"
        >
          <ArrowLeft aria-hidden className="size-5" />
        </Link>
        <Link href="/" className="font-heading text-xl font-bold tracking-tight text-white">
          Hireloop
        </Link>
        <div className="ml-auto text-xs text-[#a1a1aa]">
          {user ? (
            <span>
              Signed in as <strong className="text-white">{user.email}</strong>
            </span>
          ) : (
            <Link href="/signin?callbackUrl=/checkout" className="text-[#0070E0] hover:underline">
              Sign In to your account
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-20">
        {/* Alerts */}
        {canceled && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
            <AlertCircle className="size-5 shrink-0 text-amber-400" />
            <p>
              Your checkout was canceled. No payment was charged. You can select your plan and try
              again at any time.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="size-5 shrink-0 text-red-400" />
            <p>Payment error: {error}</p>
          </div>
        )}

        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Flexible Subscription Plans
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Supercharge Your Hiring & Career
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[#a1a1aa]">
            Unlock unlimited applications, priority listing, and instant talent engagement with
            Hireloop Pro.
          </p>
        </div>

        <CheckoutForm
          userRole={user?.role}
          initialInterval={initialInterval}
          isSubscribed={isSubscribed}
        />
      </main>
    </div>
  )
}
