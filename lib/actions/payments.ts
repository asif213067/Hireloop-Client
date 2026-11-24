const rawUrl =
  process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
  "http://localhost:5000"

const BASE_URL = rawUrl.trim().replace(/\/+$/, "")

export const checkoutVerify = async (sessionId: string) => {
  const response = await fetch(`${BASE_URL}/payments/checkout-verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
  })

  return response.json()
}
