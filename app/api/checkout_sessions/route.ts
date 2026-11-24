import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "@/lib/stripe"
import { getSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  const userSession = await getSession()

  const origin =
    request.nextUrl.origin ||
    (await headers()).get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"

  const isJsonRequest =
    request.headers.get("accept")?.includes("application/json") ||
    request.headers.get("content-type")?.includes("application/json")

  if (!userSession?.user) {
    if (isJsonRequest) {
      return NextResponse.json(
        { error: "Authentication required", loginUrl: "/signin?callbackUrl=/checkout" },
        { status: 401 }
      )
    }
    return NextResponse.redirect(new URL("/signin?callbackUrl=/checkout", origin), 303)
  }

  // Extract interval from form-data, json body, or query param
  let requestedInterval: string | null = null
  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    try {
      const body = await request.json()
      requestedInterval = body.interval
    } catch {
      // Ignore JSON parse errors and fallback
    }
  } else if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    try {
      const formData = await request.formData()
      requestedInterval = formData.get("interval") as string
    } catch {
      // Ignore formData parse errors and fallback
    }
  }

  if (!requestedInterval) {
    requestedInterval = request.nextUrl.searchParams.get("interval")
  }

  const interval = requestedInterval === "yearly" ? "yearly" : "monthly"
  const isYearly = interval === "yearly"
  const userRole = userSession.user.role || "seeker"

  const planName = isYearly ? "Hireloop Pro (Yearly)" : "Hireloop Pro (Monthly)"
  const planDescription =
    userRole === "recruiter"
      ? "Unlimited job postings & candidate access"
      : "Unlimited job applications & profile visibility"

  // Pro Monthly: $19.00 / month ($19.00 * 100 = 1900 cents)
  // Pro Yearly: $182.40 / year (20% off $228, equivalent to $15.20/month; 18240 cents)
  const unitAmount = isYearly ? 18240 : 1900

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: userSession.user.email,
      client_reference_id: userSession.user.id,
      metadata: {
        userId: userSession.user.id,
        role: userRole,
        billingInterval: interval,
      },
      subscription_data: {
        metadata: {
          userId: userSession.user.id,
          role: userRole,
          billingInterval: interval,
        },
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: planDescription,
            },
            unit_amount: unitAmount,
            recurring: {
              interval: isYearly ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=1`,
    })

    if (isJsonRequest) {
      return NextResponse.json({ url: session.url })
    }

    return NextResponse.redirect(session.url!, 303)
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error("Stripe Checkout Session creation error:", error)

    if (isJsonRequest) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(
      new URL(`/checkout?error=${encodeURIComponent(error.message)}`, origin),
      303
    )
  }
}
