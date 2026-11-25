import { apiRequest } from "@/lib/api"

export type PaymentRecord = {
  id: string
  stripeSessionId: string
  amount: number
  currency: string
  planName: string
  billingInterval: "monthly" | "yearly" | null
  status: string
  createdAt: string
}

export type UserSubscription = {
  plan: "free" | "pro"
  billingInterval?: "monthly" | "yearly" | null
  status?: "active" | "canceled" | "past_due" | "expired" | "none"
  currentPeriodStart?: string | null
  currentPeriodEnd?: string | null
  cancelAtPeriodEnd?: boolean
}

export type SeekerUsage = {
  applications?: {
    count: number
    periodStart?: string
    periodEnd?: string
  }
}

export type BillingSummaryResponse = {
  subscription: UserSubscription
  usage: SeekerUsage
  payments: PaymentRecord[]
}

export async function fetchBillingHistory(): Promise<BillingSummaryResponse | null> {
  const res = await apiRequest("/api/payments/history")
  if (res.status === 200 && res.data) {
    return res.data as BillingSummaryResponse
  }
  return null
}

export type SubscriptionActionResult = {
  ok: boolean
  message?: string
  error?: string
  subscription?: UserSubscription
}

export async function cancelSubscription(): Promise<SubscriptionActionResult> {
  const res = await apiRequest("/api/payments/cancel", { method: "POST" })
  const payload = res.data as {
    message?: string
    error?: string
    subscription?: UserSubscription
  } | null

  if (res.status === 200 && payload?.subscription) {
    return {
      ok: true,
      message: payload.message,
      subscription: payload.subscription,
    }
  }

  return {
    ok: false,
    error: payload?.error || "Could not cancel subscription. Please try again.",
  }
}

export async function reactivateSubscription(): Promise<SubscriptionActionResult> {
  const res = await apiRequest("/api/payments/reactivate", { method: "POST" })
  const payload = res.data as {
    message?: string
    error?: string
    subscription?: UserSubscription
  } | null

  if (res.status === 200 && payload?.subscription) {
    return {
      ok: true,
      message: payload.message,
      subscription: payload.subscription,
    }
  }

  return {
    ok: false,
    error: payload?.error || "Could not reactivate subscription. Please try again.",
  }
}
