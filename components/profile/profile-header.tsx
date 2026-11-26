import { MapPinIcon } from "lucide-react"

import { ProfileResume } from "@/components/profile/profile-resume"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { PublicSeekerProfile } from "@/lib/public-profiles"

type ProfileHeaderProps = {
  profile: PublicSeekerProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const locationParts = [profile.city, profile.country]
    .map((part) => part.trim())
    .filter(Boolean)
  const locationText = locationParts.join(", ")

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <UserAvatar
            name={profile.name}
            image={profile.image}
            className="size-16 shrink-0 text-lg sm:size-20 sm:text-xl"
          />

          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {profile.name}
            </h1>
            {profile.headline ? (
              <p className="text-sm font-medium text-primary sm:text-base">
                {profile.headline}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                HireLoop Candidate
              </p>
            )}

            {locationText && (
              <p className="flex items-center gap-1.5 pt-0.5 text-xs text-muted-foreground sm:text-sm">
                <MapPinIcon aria-hidden className="size-3.5 shrink-0" />
                <span>{locationText}</span>
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <ProfileResume resume={profile.resume} variant="button" />
        </div>
      </div>
    </section>
  )
}
