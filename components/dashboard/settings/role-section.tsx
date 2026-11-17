"use client"

import { useState } from "react"
import { toast } from "sonner"

import { RolePicker } from "@/components/auth/role-picker"
import { Button } from "@/components/ui/button"
import { apiRequest } from "@/lib/api"
import type { PublicSignupRole } from "@/lib/roles"

type RoleSectionProps = {
  currentRole: "seeker" | "recruiter"
}

const cardClass = "rounded-xl border border-border bg-card p-4 sm:p-6"

// Account type switch; the Express API has the final say
export function RoleSection({ currentRole }: RoleSectionProps) {
  const [role, setRole] = useState<PublicSignupRole>(currentRole)
  const [saving, setSaving] = useState(false)

  async function onSave() {
    setSaving(true)
    const { status } = await apiRequest("/api/account/role", {
      method: "PUT",
      body: { role },
    })
    setSaving(false)

    if (status === 200) {
      toast.success("Account type updated")
      // Full reload on purpose, so the server reads the new role
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/dashboard/${role}/settings`)
      return
    }
    if (status === 409) {
      toast.error("Delete your job posts before switching to a seeker account.")
      return
    }
    if (status === 403) {
      toast.error("Your account type can't be changed.")
      return
    }
    if (status === 429) {
      toast.error("Too many attempts. Please try again later.")
      return
    }
    toast.error("Could not update your account type. Please try again.")
  }

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-semibold text-foreground">Account type</h2>
      <div className="mt-4">
        <RolePicker value={role} onChange={setRole} disabled={saving} />
        <p className="mt-3 text-sm text-muted-foreground">
          Recruiters must delete their job posts before switching to a seeker
          account.
        </p>
        <Button
          onClick={onSave}
          disabled={saving || role === currentRole}
          className="mt-4 h-11 px-4"
        >
          {saving ? "Saving..." : "Save account type"}
        </Button>
      </div>
    </section>
  )
}
