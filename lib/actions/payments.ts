import { authClient } from "@/lib/auth-client"

const rawUrl =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
  "http://localhost:5000"

const BASE_URL = rawUrl.trim().replace(/\/+$/, "")

export const checkoutVerify = async (sessionId: string) => {
  let token: string | undefined
  try {
    const { data: tokenData } = await authClient.token()
    if (typeof tokenData?.token === "string") {
      token = tokenData.token
    }
  } catch {
    // Server-side execution may not have client token session
  }

  try {
    const response = await fetch(`${BASE_URL}/api/payments/checkout-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ sessionId }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => null)
      return { error: err?.error || "Payment verification failed" }
    }

    return await response.json()
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Network error" }
  }
}
