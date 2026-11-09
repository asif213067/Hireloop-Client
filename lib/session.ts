import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { auth } from "@/lib/auth"
import { getDashboardHref, isRole, type Role } from "@/lib/roles"

// Session read is deduped across layout and pages in one pass
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() })
})

// Guard for role-only pages: visitor level decides where they land
export async function requireRole(role: Role) {
  const session = await getSession()

  if (!session) redirect("/signin")

  // A user row without a role counts as a plain seeker
  const userRole: Role = isRole(session.user.role)
    ? session.user.role
    : "seeker"

  if (userRole !== role) redirect(getDashboardHref(userRole))

  return session
}
