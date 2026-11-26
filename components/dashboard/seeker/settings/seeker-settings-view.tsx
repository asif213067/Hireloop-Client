"use client"

import { useEffect, useState } from "react"

import { PersonalInfoSection } from "@/components/dashboard/seeker/settings/personal/personal-info-section"
import { ProfessionalDetailsSection } from "@/components/dashboard/seeker/settings/professional/professional-details-section"
import { ResumeSection } from "@/components/dashboard/seeker/settings/resume-section"
import { Button } from "@/components/ui/button"
import {
  fetchSeekerProfile,
  type SeekerProfileData,
} from "@/lib/profile-api"

type SeekerSettingsViewProps = {
  name: string
  email: string
  image?: string | null
}

export function SeekerSettingsView({
  name,
  email,
  image,
}: SeekerSettingsViewProps) {
  const [profile, setProfile] = useState<SeekerProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryTick, setRetryTick] = useState(0)

  useEffect(() => {
    let ignore = false

    fetchSeekerProfile()
      .then((res) => {
        if (!ignore) {
          setProfile(res)
          setError(res === null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [retryTick])

  function handleRetry() {
    setLoading(true)
    setError(false)
    setRetryTick((t) => t + 1)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details and professional profile.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {loading ? (
            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-xl border border-border bg-card/60" />
              <div className="h-80 animate-pulse rounded-xl border border-border bg-card/60" />
            </div>
          ) : error || !profile ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center">
              <p className="text-sm font-medium text-foreground">
                Could not load your profile details.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-3"
              >
                Try again
              </Button>
            </div>
          ) : (
            <>
              <PersonalInfoSection
                name={profile.name || name}
                email={profile.email || email}
                image={profile.image ?? image}
                phone={profile.phone}
                city={profile.city}
                country={profile.country}
                onProfileUpdated={(next) =>
                  setProfile((prev) => (prev ? { ...prev, ...next } : prev))
                }
              />
              <ProfessionalDetailsSection
                initialProfile={{
                  headline: profile.headline,
                  bio: profile.bio,
                  skills: profile.skills,
                  experience: profile.experience,
                  education: profile.education,
                  projects: profile.projects,
                  languages: profile.languages ?? [],
                  links: profile.links,
                }}
                onSaved={(next) =>
                  setProfile((prev) => (prev ? { ...prev, ...next } : prev))
                }
              />
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-6">
          <ResumeSection />
        </div>
      </div>
    </div>
  )
}
