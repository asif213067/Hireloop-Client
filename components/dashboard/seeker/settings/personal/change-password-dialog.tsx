"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { PasswordRules } from "@/components/auth/password-rules"
import {
  inputClass,
  labelClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { isPasswordValid } from "@/lib/password-policy"

type ChangePasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [hasPasswordAccount, setHasPasswordAccount] = useState<boolean | null>(
    null
  )
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let ignore = false
    authClient.listAccounts().then(({ data }) => {
      if (ignore) return
      setHasPasswordAccount(
        Array.isArray(data) &&
          data.some((account) => account.providerId === "credential")
      )
    })
    return () => {
      ignore = true
    }
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hasPasswordAccount === false) {
      toast.error("Google sign-in accounts do not have a local password.")
      return
    }

    if (!currentPassword) {
      toast.error("Please enter your current password.")
      return
    }

    if (!isPasswordValid(newPassword)) {
      toast.error(
        "New password must be at least 8 characters and include an uppercase letter, a number, and a special character."
      )
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.")
      return
    }

    setSaving(true)
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (error) {
        toast.error(
          error.message ||
            "Current password is incorrect, or the new password is not accepted."
        )
        return
      }

      toast.success("Password updated")
      handleOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password for your account.
          </DialogDescription>
        </DialogHeader>

        {hasPasswordAccount === false ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You sign in with Google, so there is no local password to change.
            </p>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="cp-current" className={labelClass}>
                Current Password
              </label>
              <Input
                id="cp-current"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="cp-new" className={labelClass}>
                New Password
              </label>
              <Input
                id="cp-new"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                aria-describedby="seeker-password-rules"
                className={inputClass}
              />
              <PasswordRules
                id="seeker-password-rules"
                password={newPassword}
              />
            </div>

            <div>
              <label htmlFor="cp-confirm" className={labelClass}>
                Confirm New Password
              </label>
              <Input
                id="cp-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={inputClass}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  saving ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="bg-white font-semibold text-black hover:bg-white/90"
              >
                {saving ? "Updating..." : "Update Password"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
