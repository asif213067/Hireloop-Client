"use client"

import { useState } from "react"
import { Check, CreditCard, Lock, Sparkles } from "lucide-react"

interface CheckoutFormProps {
  userRole?: string | null
  initialInterval?: "monthly" | "yearly"
  isSubscribed?: boolean
}

export function CheckoutForm({
  userRole = "seeker",
  initialInterval = "monthly",
  isSubscribed = false,
}: CheckoutFormProps) {
  const [interval, setInterval] = useState<"monthly" | "yearly">(initialInterval)
  const [submitting, setSubmitting] = useState(false)

  const isYearly = interval === "yearly"
  const isRecruiter = userRole === "recruiter"

  const planName = isYearly ? "Hireloop Pro (Yearly)" : "Hireloop Pro (Monthly)"
  const planPrice = isYearly ? "$182.40" : "$19.00"
  const billingPeriod = isYearly ? "per year" : "per month"
  const monthlyEquivalent = isYearly ? "$15.20 / mo" : "$19.00 / mo"

  const benefits = isRecruiter
    ? [
        "Unlimited job postings (bypass the 5 posts/month limit)",
        "Instant candidate profile visibility & applicant management",
        "Featured job badge & priority candidate reach",
        "Direct email & communication tools",
        "Cancel anytime with one click",
      ]
    : [
        "Unlimited job applications (bypass the 7 applies/month limit)",
        "Priority application review & candidate badge",
        "Real-time application status tracking",
        "Saved jobs & instant alert notifications",
        "Cancel anytime with one click",
      ]

  return (
    <div className="grid w-full gap-12 lg:grid-cols-2">
      {/* Left Column: Plan Options & Order Summary */}
      <section className="flex flex-col gap-8">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#808089]">
            Select billing cycle
          </p>

          {/* Billing Interval Selector */}
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-[#2e2e33] bg-[#141418] p-1.5">
            <button
              type="button"
              onClick={() => setInterval("monthly")}
              className={`flex flex-col items-center justify-center rounded-lg py-3 text-center transition-all ${
                !isYearly
                  ? "bg-[#0070E0] text-white shadow-md"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              <span className="text-sm font-semibold">Monthly</span>
              <span className="mt-0.5 text-xs opacity-90">$19 / month</span>
            </button>

            <button
              type="button"
              onClick={() => setInterval("yearly")}
              className={`relative flex flex-col items-center justify-center rounded-lg py-3 text-center transition-all ${
                isYearly
                  ? "bg-[#0070E0] text-white shadow-md"
                  : "text-[#a1a1aa] hover:text-white"
              }`}
            >
              <span className="absolute -top-2.5 right-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                <Sparkles className="size-2.5" /> Save 20%
              </span>
              <span className="text-sm font-semibold">Annual</span>
              <span className="mt-0.5 text-xs opacity-90">$15.20 / mo ($182.40/yr)</span>
            </button>
          </div>
        </div>

        {/* Plan Details & Features */}
        <div className="rounded-2xl border border-[#2e2e33] bg-[#141418] p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center rounded-md border border-[#3b82f6]/30 bg-[#3b82f6]/10 px-2.5 py-0.5 text-xs font-medium text-[#60a5fa]">
                {isRecruiter ? "Recruiter Pro" : "Candidate Pro"}
              </span>
              <h3 className="mt-2 text-xl font-bold text-white">{planName}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-white">{planPrice}</div>
              <div className="text-xs text-[#a1a1aa]">{billingPeriod}</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-[#888891]">
            {isYearly
              ? "Billed annually at $182.40. Enjoy full Pro access at just $15.20/month with 20% savings."
              : "Billed monthly at $19.00. Unlocks unlimited activity and premium candidate/recruiter capabilities."}
          </p>

          <hr className="my-5 border-[#2e2e33]" />

          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-[#d4d4d8]">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Free Plan comparison reference */}
        <div className="rounded-xl border border-white/5 bg-[#18181b]/40 p-4 text-xs text-[#71717a]">
          <span className="font-semibold text-[#a1a1aa]">Free tier reference: </span>
          {isRecruiter
            ? "Free accounts are capped at 5 job postings per month."
            : "Free accounts are capped at 7 job applications per month."}
          {" "}Pro removes all limits immediately.
        </div>
      </section>

      {/* Right Column: Checkout & Payment Method */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xs font-bold tracking-widest uppercase text-[#808089]">
          Order summary & payment
        </h2>

        {/* Pricing breakdown */}
        <div className="rounded-2xl border border-[#2e2e33] bg-[#141418] p-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#a1a1aa]">
              <span>Base price (12 months @ $19/mo)</span>
              <span className={isYearly ? "line-through text-[#71717a]" : "text-white"}>
                {isYearly ? "$228.00" : "$19.00"}
              </span>
            </div>

            {isYearly && (
              <div className="flex justify-between text-emerald-400">
                <span>Annual discount (20% off)</span>
                <span>-$45.60</span>
              </div>
            )}

            <div className="flex justify-between text-[#a1a1aa]">
              <span>Effective rate</span>
              <span className="font-medium text-white">{monthlyEquivalent}</span>
            </div>

            <hr className="border-[#2e2e33]" />

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-base font-semibold text-white">Total due today</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">{planPrice}</span>
                <span className="block text-xs text-[#808089]">
                  {isYearly ? "Plus local tax if applicable" : "Billed monthly"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="overflow-hidden rounded-xl border border-[#2e2e33] bg-[#141418]">
          <div className="flex items-center gap-3 border-b border-[#2e2e33] bg-[#1f1f23] px-4 py-3">
            <CreditCard aria-hidden className="size-4 text-[#0070E0]" />
            <span className="text-sm font-medium text-white">
              Credit Card / Debit / Wallets
            </span>
            <span className="ml-auto text-[11px] font-medium text-emerald-400">
              Stripe Secure
            </span>
          </div>

          <div className="p-4 text-sm text-[#888891] leading-relaxed">
            You will be redirected to Stripe&apos;s 256-bit encrypted checkout to complete your
            subscription. Payment credentials and card numbers are processed by Stripe and are never
            stored on Hireloop.
          </div>
        </div>

        {/* Action Button */}
        <div>
          <form
            action="/api/checkout_sessions"
            method="POST"
            onSubmit={() => setSubmitting(true)}
          >
            <input type="hidden" name="interval" value={interval} />

            <button
              type="submit"
              disabled={submitting || isSubscribed}
              className="h-14 w-full rounded-xl bg-[#0070E0] text-base font-bold text-white shadow-[0_4px_6px_-4px_rgba(94,158,246,0.3),0_10px_15px_-3px_rgba(94,158,246,0.3)] transition-colors hover:bg-[#3F90E5] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Connecting to Stripe..."
                : isSubscribed
                  ? "Already on Pro Plan"
                  : `Proceed to Checkout · ${planPrice}`}
            </button>
          </form>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#808089]">
            <Lock aria-hidden className="size-3.5" />
            Guaranteed secure checkout powered by Stripe
          </p>
        </div>
      </section>
    </div>
  )
}
