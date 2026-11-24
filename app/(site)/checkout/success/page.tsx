// Payment success — Figma "Public / Checkout — Payment Successful":
// Centered success card over ambient blue glow, with verified session box,
// receipt breakdown (amount, date, email, transaction id), print receipt capability,
// and role-tailored dashboard navigation.

import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Check, CreditCard, Home, ShieldCheck } from "lucide-react"

import { stripe } from "@/lib/stripe"
import { checkoutVerify } from "@/lib/actions/payments"
import { getSession } from "@/lib/session"
import { ReceiptActions } from "@/components/checkout/receipt-actions"

export const metadata: Metadata = {
  title: "Payment Successful | Hireloop Pro",
  description: "Your payment was processed successfully. Welcome to Hireloop Pro.",
}

// Fixed en-US locale so SSR and hydration always agree
const formatDate = (unixSeconds: number) =>
  new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) notFound()

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent", "subscription"],
    })
  } catch (err) {
    console.error("Failed to retrieve checkout session:", err)
    return redirect("/checkout?error=SessionNotFound")
  }

  if (session.status === "open") {
    return redirect("/")
  }

  if (session.status !== "complete" || session.payment_status !== "paid") {
    return redirect("/checkout/cancel")
  }

  // Fulfill subscription on server idempotently
  await checkoutVerify(session_id).catch((err) => {
    console.error("checkoutVerify error:", err)
  })

  // Get current user session to determine role & dashboard destinations
  const userSession = await getSession()
  const isRecruiter = userSession?.user?.role === "recruiter"

  const dashboardHref = isRecruiter
    ? "/dashboard/recruiter/jobs"
    : "/dashboard/seeker/applications"

  const dashboardLabel = isRecruiter
    ? "Go to Posted Jobs"
    : "Go to My Applications"

  const billingHref = isRecruiter
    ? "/dashboard/recruiter/settings"
    : "/dashboard/seeker/billing"

  // Receipt details — Stripe amounts are in CENTS, divide by 100!
  const rawAmount = session.amount_total ?? 0
  const amountInDollars = rawAmount / 100
  const amount = amountInDollars.toLocaleString("en-US", {
    style: "currency",
    currency: session.currency || "usd",
  })

  const lineItems = session.line_items?.data ?? []
  const planName = lineItems[0]?.description || "Hireloop Pro Plan"

  // Derive billing interval from session amount or metadata
  const isYearly =
    session.metadata?.billingInterval === "yearly" ||
    rawAmount > 5000 ||
    planName.toLowerCase().includes("yearly") ||
    planName.toLowerCase().includes("annual")

  const billingCycleLabel = isYearly ? "Annual (Save 20%)" : "Monthly"

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#08080a] text-white">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/35 blur-[140px]"
      />

      {/* Main card */}
      <main className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 py-10 sm:py-16">
        <section className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#141418] p-6 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_rgba(255,255,255,0.04)] sm:p-10">
          {/* Green checkmark badge with glow */}
          <div className="flex justify-center">
            <span
              aria-hidden
              className="flex size-16 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.45)]"
            >
              <Check strokeWidth={3} className="size-8 text-white" />
            </span>
          </div>

          <p className="mt-6 inline-flex h-6 items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
            Upgrade Successful
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#EDEDEF] sm:text-3xl">
            Welcome to Hireloop Pro
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#9ca3af] sm:text-base">
            Your payment of <strong className="font-bold text-white">{amount}</strong> was received
            successfully. All premium features, unlimited limits, and priority badges are now active
            on your account.
          </p>

          {/* Receipt card */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#1f2937] bg-black/80 p-5 text-left sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-[#1f2937] pb-3.5">
              <div className="flex items-center gap-2">
                <ShieldCheck aria-hidden className="size-5 shrink-0 text-emerald-400" />
                <span className="text-xs font-semibold text-white sm:text-sm">
                  Stripe Verified Payment
                </span>
              </div>

              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                Paid
              </span>
            </div>

            <dl className="divide-y divide-[#1f2937]">
              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="shrink-0 text-[#888891]">Subscribed Plan</dt>
                <dd className="min-w-0 font-medium text-[#EDEDEF]">{planName}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="shrink-0 text-[#888891]">Billing Cycle</dt>
                <dd className="font-medium text-[#EDEDEF]">{billingCycleLabel}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="shrink-0 text-[#888891]">Amount Paid</dt>
                <dd className="font-bold text-emerald-400 sm:text-base">{amount}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="shrink-0 text-[#888891]">Payment Date</dt>
                <dd className="text-[#EDEDEF]">{formatDate(session.created)}</dd>
              </div>

              {session.customer_email && (
                <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                  <dt className="shrink-0 text-[#888891]">Receipt Email</dt>
                  <dd className="truncate text-[#EDEDEF]">{session.customer_email}</dd>
                </div>
              )}

              {/* Session ID row: fully responsive with truncate and zero overflow */}
              <div className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
                <dt className="shrink-0 text-[#888891]">Reference ID</dt>
                <dd className="min-w-0 max-w-full">
                  <code
                    title={session_id}
                    className="block max-w-full truncate rounded bg-[#1f2937] px-2 py-0.5 font-mono text-[11px] text-[#9ca3af] select-all sm:max-w-64"
                  >
                    {session_id}
                  </code>
                </dd>
              </div>
            </dl>

            <ReceiptActions sessionId={session_id} />
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={dashboardHref}
              className="flex py-4 h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black shadow-lg transition-transform hover:bg-white/90 active:scale-[0.98]"
            >
              <span>{dashboardLabel}</span>
              <ArrowRight aria-hidden className="size-4" />
            </Link>

            <Link
              href={billingHref}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-white/10 hover:text-white"
            >
              <CreditCard className="size-4 text-primary" />
              <span>Billing</span>
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
