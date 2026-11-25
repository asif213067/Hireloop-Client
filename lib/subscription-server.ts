import { ObjectId } from "mongodb"
import { db } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export type ValidatedSubscription = {
  isActivePro: boolean
  plan: "free" | "pro"
  billingInterval: "monthly" | "yearly" | null
  status: "active" | "canceled" | "past_due" | "expired" | "none"
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

function toValidDate(value: unknown): Date | null {
  if (value == null) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return null
    const d = new Date(value < 1e12 ? value * 1000 : value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return null
    const d = new Date(trimmed)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

function calculateExactExpirationDate(
  startDate: Date,
  interval: "monthly" | "yearly"
): Date {
  const d = new Date(startDate.getTime())
  if (interval === "yearly") {
    const targetMonth = d.getMonth()
    d.setFullYear(d.getFullYear() + 1)
    if (d.getMonth() !== targetMonth) d.setDate(0)
  } else {
    const targetMonth = (d.getMonth() + 1) % 12
    d.setMonth(d.getMonth() + 1)
    if (d.getMonth() !== targetMonth) d.setDate(0)
  }
  return d
}

/**
 * Validates the user's subscription against MongoDB and Stripe.
 * Automatically downgrades expired plans and enforces the single active Pro rule.
 */
export async function getValidatedUserSubscription(
  userId: string
): Promise<ValidatedSubscription> {
  const empty: ValidatedSubscription = {
    isActivePro: false,
    plan: "free",
    billingInterval: null,
    status: "none",
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  }

  if (!userId || !ObjectId.isValid(userId)) {
    return empty
  }

  const userObjId = new ObjectId(userId)
  const usersCol = db.collection("user")
  const userDoc = await usersCol.findOne(
    { _id: userObjId },
    { projection: { subscription: 1 } }
  )

  const sub = userDoc?.subscription as
    | {
        plan?: string
        billingInterval?: "monthly" | "yearly" | null
        status?: string
        stripeSubscriptionId?: string | null
        currentPeriodStart?: unknown
        currentPeriodEnd?: unknown
        cancelAtPeriodEnd?: boolean
      }
    | undefined

  if (!sub) return empty

  let plan: "free" | "pro" = sub.plan === "pro" ? "pro" : "free"
  let billingInterval: "monthly" | "yearly" | null =
    sub.billingInterval === "yearly"
      ? "yearly"
      : sub.billingInterval === "monthly"
        ? "monthly"
        : null
  let status = (sub.status || "none") as ValidatedSubscription["status"]
  let cancelAtPeriodEnd = Boolean(sub.cancelAtPeriodEnd)
  let periodStart = toValidDate(sub.currentPeriodStart)
  let periodEnd = toValidDate(sub.currentPeriodEnd)

  // Live Stripe check if a Stripe subscription ID exists
  if (sub.stripeSubscriptionId) {
    try {
      const stripeSub = await stripe.subscriptions.retrieve(
        sub.stripeSubscriptionId
      )
      const item0 = stripeSub.items?.data?.[0] as
        | {
            current_period_start?: number
            current_period_end?: number
            price?: { recurring?: { interval?: string } }
          }
        | undefined

      const stripeInterval = item0?.price?.recurring?.interval
      if (!billingInterval && stripeInterval) {
        billingInterval = stripeInterval === "year" ? "yearly" : "monthly"
      }

      const rawStart =
        (stripeSub as unknown as { current_period_start?: number })
          .current_period_start ??
        item0?.current_period_start ??
        stripeSub.start_date ??
        stripeSub.created
      const rawEnd =
        (stripeSub as unknown as { current_period_end?: number })
          .current_period_end ?? item0?.current_period_end

      periodStart = toValidDate(rawStart) || periodStart || new Date()
      periodEnd =
        toValidDate(rawEnd) ||
        calculateExactExpirationDate(periodStart, billingInterval || "monthly")
      cancelAtPeriodEnd = Boolean(stripeSub.cancel_at_period_end)

      const isExpired = periodEnd.getTime() <= Date.now()
      if (isExpired) {
        plan = "free"
        status = "expired"
      } else if (stripeSub.status === "canceled" || cancelAtPeriodEnd) {
        plan = "pro"
        status = "canceled"
      } else if (
        stripeSub.status === "active" ||
        stripeSub.status === "trialing"
      ) {
        plan = "pro"
        status = "active"
      } else {
        plan = "free"
        status = (stripeSub.status as ValidatedSubscription["status"]) || "none"
      }

      await usersCol.updateOne(
        { _id: userObjId },
        {
          $set: {
            "subscription.plan": plan,
            "subscription.billingInterval": billingInterval,
            "subscription.status": status,
            "subscription.currentPeriodStart": periodStart,
            "subscription.currentPeriodEnd": periodEnd,
            "subscription.cancelAtPeriodEnd": cancelAtPeriodEnd,
            updatedAt: new Date(),
          },
        }
      )
    } catch {
      // Fall back to database state if Stripe is unreachable
    }
  }

  // Enforce expiration against current time
  if (periodEnd && periodEnd.getTime() <= Date.now()) {
    if (plan === "pro") {
      plan = "free"
      status = "expired"
      await usersCol.updateOne(
        { _id: userObjId },
        {
          $set: {
            "subscription.plan": "free",
            "subscription.status": "expired",
            updatedAt: new Date(),
          },
        }
      )
    }
  }

  const isActivePro =
    plan === "pro" &&
    (!periodEnd || periodEnd.getTime() > Date.now()) &&
    (status === "active" || status === "canceled")

  return {
    isActivePro,
    plan: isActivePro ? "pro" : "free",
    billingInterval,
    status,
    currentPeriodStart: periodStart ? periodStart.toISOString() : null,
    currentPeriodEnd: periodEnd ? periodEnd.toISOString() : null,
    cancelAtPeriodEnd,
  }
}
