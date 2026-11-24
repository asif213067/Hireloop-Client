// Payment success — Figma "Public / Checkout — Payment Successful":
// Centered success card over ambient blue glow, with verified session box,
// receipt breakdown (amount, date, email, transaction id), print receipt capability,
// and role-tailored dashboard navigation.

import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, CreditCard, ShieldCheck } from "lucide-react"

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

  // Receipt details
  const paymentIntent =
    typeof session.payment_intent === "object" ? session.payment_intent : null
  const transactionId = paymentIntent?.id ?? session.id
  const amount = (session.amount_total ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: session.currency || "usd",
  })
  const lineItems = session.line_items?.data ?? []
  const planName = lineItems[0]?.description || "Hireloop Pro Plan"

  // Mono chip for long Stripe IDs
  const idChip = (id: string) => (
    <code
      title={id}
      className="max-w-44 truncate rounded bg-[#1f2937] px-2 py-0.5 font-mono text-[11px] text-[#9ca3af] select-all sm:max-w-56"
    >
      {id}
    </code>
  )

  return (
    <div className="relative min-h-screen bg-[#08080a] text-white">
      {/* Top minimal header */}
      <header className="mx-auto flex h-20 w-full max-w-4xl items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="Back to home"
            className="mr-5 text-[#a1a1aa] transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden className="size-5" />
          </Link>
          <Link href="/" className="font-heading text-lg font-bold tracking-tight text-white">
            Hireloop
          </Link>
        </div>

        <Link
          href={billingHref}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#a1a1aa] transition-colors hover:bg-white/10 hover:text-white"
        >
          <CreditCard className="size-3.5 text-primary" />
          <span>Billing & Plan</span>
        </Link>
      </header>

      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-1/2 size-120 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a]/40 blur-[130px]"
      />

      {/* Main card */}
      <main className="relative mx-auto flex w-full max-w-xl flex-col items-center px-4 pt-4 pb-24">
        <section className="w-full rounded-3xl border border-white/10 bg-[#141418] p-6 text-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_rgba(255,255,255,0.04)] sm:p-10">
          {/* Green checkmark badge with glow */}
          <div className="flex justify-center">
            <span
              aria-hidden
              className="flex size-16 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
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
            Your payment of <strong className="text-white">{amount}</strong> was received
            successfully. All premium features, unlimited limits, and priority badges are now
            active on your account.
          </p>

          {/* Receipt card */}
          <div className="mt-8 rounded-2xl border border-[#1f2937] bg-black/80 p-5 text-left">
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden className="size-5 shrink-0 text-emerald-400" />
              <span className="text-xs font-semibold text-white sm:text-sm">
                Stripe Verified Session
              </span>
              <span className="ml-auto">{idChip(session_id)}</span>
            </div>

            <dl className="mt-4 divide-y divide-[#1f2937] border-t border-[#1f2937]">
              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="shrink-0 text-[#888891]">Transaction ID</dt>
                <dd>{idChip(transactionId)}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="text-[#888891]">Subscribed Plan</dt>
                <dd className="font-medium text-[#EDEDEF]">{planName}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="text-[#888891]">Amount Paid</dt>
                <dd className="font-semibold text-emerald-400">{amount}</dd>
              </div>

              <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                <dt className="text-[#888891]">Payment Date</dt>
                <dd className="text-[#EDEDEF]">{formatDate(session.created)}</dd>
              </div>

              {session.customer_email && (
                <div className="flex items-center justify-between gap-4 py-2.5 text-xs sm:text-sm">
                  <dt className="text-[#888891]">Receipt Email</dt>
                  <dd className="truncate text-[#EDEDEF]">{session.customer_email}</dd>
                </div>
              )}
            </dl>

            <ReceiptActions sessionId={session_id} />
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={dashboardHref}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black shadow-lg transition-transform hover:bg-white/90 active:scale-[0.98]"
            >
              <span>{dashboardLabel}</span>
              <ArrowRight aria-hidden className="size-4" />
            </Link>

            <Link
              href="/"
              className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
