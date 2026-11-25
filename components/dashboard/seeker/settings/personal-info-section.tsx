"use client"

import { useState } from "react"
import { LockIcon } from "lucide-react"
import { toast } from "sonner"

import { UserAvatar } from "@/components/shared/user-avatar"
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
import { Separator } from "@/components/ui/separator"

type PersonalInfoSectionProps = {
  name: string
  email: string
  image?: string | null
}

const labelClass = "mb-1.5 block text-sm font-medium text-foreground"
const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground"

export function PersonalInfoSection({
  name,
  email,
  image,
}: PersonalInfoSectionProps) {
  const [fullName, setFullName] = useState(name)
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")

  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function handleAvatarClick() {
    toast.info("Profile image upload is coming soon.")
  }

  function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    toast.info("Profile updates will be available soon.")
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.info("Password update is coming soon.")
  }

  function handlePasswordDialogOpenChange(open: boolean) {
    setPasswordOpen(open)
    if (!open) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Personal Information
      </h2>

      {/* Avatar Row */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <UserAvatar
          name={fullName || name}
          image={image}
          className="size-16 text-lg"
        />
        <div className="space-y-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAvatarClick}
            className="h-9 rounded-lg border-border bg-background/60 px-3.5 text-xs font-medium"
          >
            Update Profile Image
          </Button>
          <p className="text-xs text-muted-foreground">
            JPG, GIF or PNG. Max size of 5MB.
          </p>
        </div>
      </div>

      {/* Personal Info Form */}
      <form onSubmit={handleUpdateProfile} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="seeker-full-name" className={labelClass}>
              Full Name
            </label>
            <Input
              id="seeker-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="seeker-email" className={labelClass}>
              Email Address
            </label>
            <Input
              id="seeker-email"
              type="email"
              value={email}
              readOnly
              disabled
              className="h-10 w-full rounded-lg border border-border bg-input/30 px-3 text-sm text-muted-foreground disabled:cursor-not-allowed disabled:opacity-75"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Email changes will be available soon.
            </p>
          </div>

          <div>
            <label htmlFor="seeker-phone" className={labelClass}>
              Phone Number
            </label>
            <Input
              id="seeker-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="seeker-city" className={labelClass}>
                City
              </label>
              <Input
                id="seeker-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="seeker-country" className={labelClass}>
                Country
              </label>
              <Input
                id="seeker-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"
          >
            Update Profile
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPasswordOpen(true)}
            className="h-10 rounded-lg border-border bg-background/60 px-4 text-sm font-medium"
          >
            <LockIcon aria-hidden className="mr-1.5 size-3.5" />
            Change Password
          </Button>
        </div>
      </form>

      {/* Change Password Dialog (UI only) */}
      <Dialog open={passwordOpen} onOpenChange={handlePasswordDialogOpenChange}>
        <DialogContent className="border border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password for your account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="cp-current" className={labelClass}>
                Current Password
              </label>
              <Input
                id="cp-current"
                type="password"
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="cp-confirm" className={labelClass}>
                Confirm New Password
              </label>
              <Input
                id="cp-confirm"
                type="password"
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
                onClick={() => handlePasswordDialogOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-white font-semibold text-black hover:bg-white/90"
              >
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
