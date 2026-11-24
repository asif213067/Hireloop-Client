"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  RefreshCw,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  fetchBillingHistory,
  type BillingSummaryResponse,
} from "@/lib/payments-api"

const FREE_APPLICATION_LIMIT = 7

function formatCurrency(amountCents: number, currency = "usd") {
  return (amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  })
}

function formatDate(isoDateString?: string | null) {
  if (!isoDateString) return "N/A"
  try {
    return new Date(isoDateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  } catch {
    return isoDateString
  }
}

export function SeekerBillingView() {
  const [data, setData] = useState<BillingSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const res = await fetchBillingHistory()
      setData(res)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const subscription = data?.subscription
  const isPro = subscription?.plan === "pro"
  const isYearly = subscription?.billingInterval === "yearly"
  const applicationsUsed = data?.usage?.applications?.count ?? 0
  const remaining = Math.max(0, FREE_APPLICATION_LIMIT - applicationsUsed)
  const usagePercent = Math.min(
    100,
    Math.round((applicationsUsed / FREE_APPLICATION_LIMIT) * 100)
  )

  const payments = data?.payments ?? []

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Subscription & Billing
          </h1>
          <p className="mt-1 text-sm text-[#a1a1aa]">
            Manage your subscription plan, monitor your monthly application allowance, and access
            payment receipts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
          className="self-start border-border bg-card/60 text-xs sm:self-auto"
        >
          <RefreshCw
            className={`mr-1.5 size-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-44 w-full animate-pulse rounded-2xl border border-white/5 bg-card/50" />
          <div className="h-64 w-full animate-pulse rounded-2xl border border-white/5 bg-card/50" />
        </div>
      ) : (
        <>
          {/* Subscription Status Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                      isPro
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border border-zinc-700 bg-zinc-800/80 text-zinc-300"
                    }`}
                  >
                    {isPro ? (
                      <>
                        Pro Plan Active
                      </>
                    ) : (
                      "Free Tier"
                    )}
                  </span>

                  {isPro && (
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-[#a1a1aa]">
                      {isYearly ? "Annual Billing ($182.40/yr)" : "Monthly Billing ($19/mo)"}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {isPro
                      ? isYearly
                        ? "Hireloop Pro (Yearly)"
                        : "Hireloop Pro (Monthly)"
                      : "Free Starter Plan"}
                  </h2>
                  <p className="mt-1 text-sm text-[#a1a1aa]">
                    {isPro
                      ? "You have unlimited monthly job applications and full premium candidate benefits unlocked."
                      : "You are currently on the free tier with basic search and monthly application limits."}
                  </p>
                </div>

                {isPro && subscription?.currentPeriodEnd && (
                  <div className="flex items-center gap-2 text-xs text-[#888891]">
                    <Clock className="size-3.5" />
                    <span>
                      Current billing period renews on:{" "}
                      <strong className="text-white">
                        {formatDate(subscription.currentPeriodEnd)}
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                {isPro ? (
                  <Link
                    href="/checkout"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <span>Change Plan</span>
                    <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <Link
                    href="/checkout"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0070E0] px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#3F90E5]"
                  >
                    <Zap className="size-4" />
                    <span>Upgrade to Pro · $19/mo</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Free Tier Usage Tracker */}
            {!isPro && (
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <FileText className="size-4 text-[#0070E0]" />
                    <span>Monthly Job Applications Usage</span>
                  </div>
                  <span className="text-xs text-[#a1a1aa]">
                    <strong className="text-white">{applicationsUsed}</strong> of{" "}
                    <strong>{FREE_APPLICATION_LIMIT}</strong> applications used this month (
                    {remaining} remaining)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      applicationsUsed >= FREE_APPLICATION_LIMIT
                        ? "bg-red-500"
                        : applicationsUsed >= 5
                          ? "bg-amber-500"
                          : "bg-[#0070E0]"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>

                {applicationsUsed >= FREE_APPLICATION_LIMIT && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    <AlertCircle className="size-4 shrink-0 text-red-400" />
                    <span>
                      You have reached the free application limit for this monthly cycle. Upgrade to
                      Pro now to apply to unlimited jobs immediately!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm font-semibold">Unlimited Applications</span>
              </div>
              <p className="mt-2 text-xs text-[#888891]">
                Apply to any job opening without hitting the 7-application monthly limit.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm font-semibold">Priority Candidate Badge</span>
              </div>
              <p className="mt-2 text-xs text-[#888891]">
                Distinguish your applications to recruiters with verified Pro status and top
                placement.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm font-semibold">20% Annual Discount</span>
              </div>
              <p className="mt-2 text-xs text-[#888891]">
                Save $45.60/year with the annual plan, paying only $15.20/month equivalent.
              </p>
            </div>
          </div>

          {/* Payment History Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-[#a1a1aa]" />
                <h3 className="text-base font-semibold text-white">Billing History & Invoices</h3>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="p-10 text-center">
                <CreditCard className="mx-auto size-10 text-zinc-600" />
                <p className="mt-3 text-sm font-medium text-white">No payment history yet</p>
                <p className="mt-1 text-xs text-[#888891]">
                  When you subscribe or renew your Pro membership, your invoices and receipts will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-zinc-900/50 text-xs font-semibold text-[#888891] uppercase">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Description</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-white/[0.02]">
                        <td className="px-6 py-4 text-xs text-[#a1a1aa] whitespace-nowrap">
                          {formatDate(p.createdAt)}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          {p.planName || "Hireloop Pro"}
                          {p.billingInterval && (
                            <span className="ml-2 text-xs text-[#888891] capitalize">
                              ({p.billingInterval})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                          {formatCurrency(p.amount, p.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <Check className="size-3" />
                            {p.status === "succeeded" ? "Paid" : p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Link
                            href={`/checkout/success?session_id=${encodeURIComponent(p.stripeSessionId)}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#0070E0] hover:underline"
                          >
                            <span>View Receipt</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
