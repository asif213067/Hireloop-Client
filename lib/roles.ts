export const ROLES = ["seeker", "recruiter", "admin"] as const
export const PUBLIC_SIGNUP_ROLES = [
  "seeker",
  "recruiter",
] as const

export type Role = (typeof ROLES)[number]
export type PublicSignupRole = Exclude<Role, "admin">

// Narrow an unknown value to a role
export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
}

// Only these roles may be chosen on the public sign-up form
export function isPublicSignupRole(value: unknown): value is PublicSignupRole {
  return (
    typeof value === "string" &&
    (PUBLIC_SIGNUP_ROLES as readonly string[]).includes(value)
  )
}

// Profile page route per role: recruiter is the only special case
export function getProfileHref(role: unknown): string {
  return role === "recruiter" ? "/recruiter/profile" : "/seeker/profile"
}
