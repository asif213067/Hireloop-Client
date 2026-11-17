"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { AuthField } from "@/components/auth/auth-field"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

type ProfileSectionProps = {
  name: string
  email: string
}

const cardClass = "rounded-xl border border-border bg-card p-4 sm:p-6"
const emailInputClass =
  "h-11 w-full rounded-lg border border-border bg-input/30 px-3 text-sm text-muted-foreground outline-none disabled:opacity-70"

// Name and email; only the name is editable today
export function ProfileSection({ name, email }: ProfileSectionProps) {
  const router = useRouter()
  const [currentName, setCurrentName] = useState(name)
  const [saving, setSaving] = useState(false)

  const unchanged = currentName.trim() === name

  async function onSave() {
    setSaving(true)
    const { error } = await authClient.updateUser({ name: currentName.trim() })
    setSaving(false)

    if (error) {
      toast.error("Could not update your name. Please try again.")
      return
    }
    // The dashboard shell reads the name from the server session
    setCurrentName(currentName.trim())
    toast.success("Name updated")
    router.refresh()
  }

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-semibold text-foreground">Profile</h2>
      <div className="mt-4 max-w-sm space-y-4">
        <AuthField
          id="settings-name"
          label="Name"
          autoComplete="name"
          placeholder="Your full name"
          value={currentName}
          onChange={setCurrentName}
        />
        <div>
          <label
            htmlFor="settings-email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="settings-email"
            name="settings-email"
            type="text"
            value={email}
            readOnly
            disabled
            className={emailInputClass}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Your email can&apos;t be changed yet. Email changes will be
            available soon.
          </p>
        </div>
        <Button
          onClick={onSave}
          disabled={saving || unchanged}
          className="h-11 px-4"
        >
          {saving ? "Saving..." : "Save name"}
        </Button>
      </div>
    </section>
  )
}
