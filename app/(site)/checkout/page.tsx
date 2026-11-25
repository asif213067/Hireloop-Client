import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { getSession } from "@/lib/session"
import { getValidatedUserSubscription } from "@/lib/subscription-server"
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
  const activeSubscription = user
    ? await getValidatedUserSubscription(user.id)
    : null
  const isSubscribed = Boolean(activeSubscription?.isActivePro)

  const initialInterval = interval === "yearly" ? "yearly" : "monthly"

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#08080a] text-white">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-12">
        {/* User sign-in status pill if applicable */}
        <div className="mb-6 flex items-center justify-end text-xs text-[#a1a1aa]">
          {user ? (
            <span>
              Account: <strong className="text-white">{user.email}</strong>
            </span>
          ) : (
            <Link
              href="/signin?callbackUrl=/checkout"
              className="text-[#0070E0] hover:underline"
            >
              Sign in to your account
            </Link>
          )}
        </div>

        {/* Alerts */}
        {canceled && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
            <AlertCircle className="size-5 shrink-0 text-amber-400" />
            <p>
              Your checkout was canceled. No payment was charged. You can select your plan and try
              again at any time.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <AlertCircle className="size-5 shrink-0 text-red-400" />
            <p>Payment error: {error}</p>
          </div>
        )}

        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase">
            Flexible Subscription Plans
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Supercharge Your Hiring & Career
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#a1a1aa] sm:text-base">
            Unlock unlimited applications, priority listing, and instant talent engagement with
            Hireloop Pro.
          </p>
        </div>

        <CheckoutForm
          userRole={user?.role}
          initialInterval={initialInterval}
          isSubscribed={isSubscribed}
          activeSubscription={activeSubscription}
        />
      </main>
    </div>
  )
}
