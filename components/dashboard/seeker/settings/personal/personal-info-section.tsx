"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LockIcon } from "lucide-react"
import { toast } from "sonner"

import {
  cardClass,
  inputClass,
  labelClass,
} from "@/components/dashboard/seeker/settings/form-styles"
import { AvatarUploader } from "@/components/dashboard/seeker/settings/personal/avatar-uploader"
import { ChangePasswordDialog } from "@/components/dashboard/seeker/settings/personal/change-password-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { savePersonalProfile } from "@/lib/profile-api"

type PersonalInfoSectionProps = {
  name: string
  email: string
  image?: string | null
  phone: string
  city: string
  country: string
  onProfileUpdated: (next: {
    name?: string
    image?: string | null
    phone?: string
    city?: string
    country?: string
  }) => void
}

export function PersonalInfoSection({
  name,
  email,
  image,
  phone: initialPhone,
  city: initialCity,
  country: initialCountry,
  onProfileUpdated,
}: PersonalInfoSectionProps) {
  const router = useRouter()

  const [fullName, setFullName] = useState(name)
  const [phone, setPhone] = useState(initialPhone)
  const [city, setCity] = useState(initialCity)
  const [country, setCountry] = useState(initialCountry)
  const [savingProfile, setSavingProfile] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    if (savingProfile) return
    const trimmedName = fullName.trim()
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      toast.error("Full name must be 2 to 80 characters.")
      return
    }

    setSavingProfile(true)
    try {
      const result = await savePersonalProfile({
        name: trimmedName,
        phone: phone.trim(),
        city: city.trim(),
        country: country.trim(),
      })

      if (!result.ok || !result.personal) {
        toast.error(result.error || "Could not update personal information.")
        return
      }

      setFullName(result.personal.name)
      setPhone(result.personal.phone)
      setCity(result.personal.city)
      setCountry(result.personal.country)
      onProfileUpdated(result.personal)
      toast.success("Personal information updated")
      router.refresh()
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <section className={cardClass}>
      <h2 className="text-lg font-semibold text-foreground">
        Personal Information
      </h2>

      <AvatarUploader
        name={fullName || name}
        image={image ?? null}
        onUploaded={(imageUrl) => onProfileUpdated({ image: imageUrl })}
      />

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
            disabled={savingProfile}
            className="h-10 rounded-lg bg-white px-4 text-sm font-semibold text-black hover:bg-white/90"
          >
            {savingProfile ? "Saving..." : "Update Profile"}
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

      <ChangePasswordDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
      />
    </section>
  )
}
