// Checkout Canceled Page — matching dark luxury aesthetic
// Displayed when a user aborts or cancels their checkout on Stripe.
// Guarantees clarity: explains no charge occurred, outlines options, and routes back smoothly.

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HelpCircle, Home, ShieldAlert, Sparkles } from "lucide-react"

import { getSession } from "@/lib/session"

export const metadata: Metadata = {
  title: "Checkout Canceled | Hireloop",
  description: "Your checkout was not completed. No charges were made to your card.",
}

export default async function CheckoutCancelPage() {
  const session = await getSession()
  const user = session?.user ?? null
  const isRecruiter = user?.role === "recruiter"

  const dashboardHref = isRecruiter
    ? "/dashboard/recruiter"
    : "/dashboard/seeker"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#08080a] text-white">
      {/* Ambient amber glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/15 blur-[140px]"
      />

      {/* Main Container */}
      <main className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 py-10 sm:py-16">
        <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#141418] p-6 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_rgba(255,255,255,0.04)] sm:p-10">
          {/* Amber shield icon */}
          <div className="flex justify-center">
            <span
              aria-hidden
              className="flex size-16 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
            >
              <ShieldAlert className="size-8 text-amber-400" />
            </span>
          </div>

          <p className="mt-6 inline-flex h-6 items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 text-[11px] font-semibold tracking-wider text-amber-300 uppercase">
            Checkout Canceled
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#EDEDEF] sm:text-3xl">
            No Charges Were Made
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9ca3af] sm:text-base">
            Your checkout was stopped before completion. Your card has not been billed, and your
            account remains on the <strong className="text-white">Free Plan</strong> with full
            standard access.
          </p>

          {/* Info Card */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#1f2937] bg-black/70 p-5 text-left sm:p-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-[#888891]" />
              <h2 className="text-xs font-semibold tracking-wider text-[#a1a1aa] uppercase">
                Common reasons & next steps
              </h2>
            </div>

            <ul className="mt-3.5 space-y-2.5 text-xs text-[#9ca3af] sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>
                  <strong>Need a different billing cycle?</strong> You can choose between Monthly
                  ($19/mo) and Annual ($182.40/yr with 20% discount) at checkout.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>
                  <strong>Payment method issue?</strong> Stripe supports all major credit/debit
                  cards, Apple Pay, Google Pay, and other global options.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>
                  <strong>Stay on Free:</strong> You can continue applying to jobs (up to 7/mo) or
                  posting roles (up to 5/mo) at zero cost.
                </span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0070E0] text-sm font-semibold text-white shadow-lg transition-transform hover:bg-[#3F90E5] active:scale-[0.98]"
            >
              <Sparkles className="size-4" />
              <span>Return to Checkout</span>
            </Link>

            <Link
              href={dashboardHref}
              className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-white/10 hover:text-white"
            >
              <span>Dashboard</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/"
              className="flex h-12 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-white/10 hover:text-white"
            >
              <Home className="size-4" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
