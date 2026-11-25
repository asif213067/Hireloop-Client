import { PersonalInfoSection } from "@/components/dashboard/seeker/settings/personal-info-section"
import { ProfessionalDetailsSection } from "@/components/dashboard/seeker/settings/professional-details-section"
import { ResumeSection } from "@/components/dashboard/seeker/settings/resume-section"

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
          <PersonalInfoSection name={name} email={email} image={image} />
          <ProfessionalDetailsSection />
        </div>

        <div className="lg:sticky lg:top-6">
          <ResumeSection />
        </div>
      </div>
    </div>
  )
}
