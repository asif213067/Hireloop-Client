import { authClient } from "@/lib/auth-client"

// Result of an API call; status 0 means the request never completed
export type ApiResult = {
  status: number
  data: unknown
}

type ApiOptions = {
  method?: string
  body?: unknown
}

// Bearer request to the Express API; token is fetched fresh and never stored
export async function apiRequest(path: string, options?: ApiOptions): Promise<ApiResult> {
  const raw = process.env.NEXT_PUBLIC_SERVER_BASE_URL
  if (typeof raw !== "string" || raw.trim() === "") return { status: 0, data: null }

  const { data: tokenData, error: tokenError } = await authClient.token()
  const token: unknown = tokenData?.token
  if (tokenError !== null || typeof token !== "string" || token === "") {
    return { status: 0, data: null }
  }

  try {
    const response = await fetch(`${raw.trim().replace(/\/+$/, "")}${path}`, {
      method: options?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options?.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: options?.body === undefined ? undefined : JSON.stringify(options.body),
    })

    if (response.status === 204) return { status: 204, data: null }

    const data: unknown = await response.json().catch(() => null)
    return { status: response.status, data }
  } catch {
    return { status: 0, data: null }
  }
}
