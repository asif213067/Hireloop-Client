"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { PasswordField } from "@/components/auth/auth-field"
import { PasswordRules } from "@/components/auth/password-rules"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { isPasswordValid } from "@/lib/password-policy"

const cardClass = "rounded-xl border border-border bg-card p-4 sm:p-6"

// Password change; only for users who actually have a password
export function PasswordSection() {
  const [checked, setChecked] = useState(false)
  const [hasPassword, setHasPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [saving, setSaving] = useState(false)

  // Accounts answer decides whether this section applies at all
  useEffect(() => {
    let cancelled = false
    authClient.listAccounts().then(({ data }) => {
      if (cancelled) return
      // providerId "credential" means the user signs in with a password
      setHasPassword(
        Array.isArray(data) &&
          data.some((account) => account.providerId === "credential")
      )
      setChecked(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Still asking the server which accounts this user has
  if (!checked) return null

  if (!hasPassword) {
    return (
      <section className={cardClass}>
        <h2 className="text-lg font-semibold text-foreground">Password</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          You sign in with Google, so there is no password to change.
        </p>
      </section>
    )
  }

  async function onChange() {
    if (!isPasswordValid(newPassword)) {
      toast.error(
        "Current password is incorrect, or the new password is not accepted."
      )
      return
    }

    setSaving(true)
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    })
    setSaving(false)

    if (error) {
      toast.error(
        "Current password is incorrect, or the new password is not accepted."
      )
      return
    }
    setCurrentPassword("")
    setNewPassword("")
    toast.success("Password updated")
  }

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-semibold text-foreground">Password</h2>
      <div className="mt-4 max-w-sm space-y-4">
        <PasswordField
          id="settings-current-password"
          label="Current password"
          autoComplete="current-password"
          placeholder="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <div>
          <PasswordField
            id="settings-new-password"
            label="New password"
            autoComplete="new-password"
            placeholder="New password"
            value={newPassword}
            onChange={setNewPassword}
            describedBy="settings-password-rules"
          />
          <PasswordRules id="settings-password-rules" password={newPassword} />
        </div>
        <Button
          onClick={onChange}
          disabled={saving || currentPassword === "" || newPassword === ""}
          className="h-11 px-4"
        >
          {saving ? "Saving..." : "Change password"}
        </Button>
      </div>
    </section>
  )
}
