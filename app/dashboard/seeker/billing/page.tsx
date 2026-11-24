import type { Metadata } from "next"

import { SeekerBillingView } from "@/components/dashboard/seeker/billing-view"
import { requireRole } from "@/lib/session"

export const metadata: Metadata = {
  title: "Billing & Subscription",
  description: "View and manage your Hireloop subscription plan and billing history.",
  robots: { index: false, follow: false },
}

export default async function SeekerBillingPage() {
  await requireRole("seeker")

  return <SeekerBillingView />
}
