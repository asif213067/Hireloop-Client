import { PasswordSection } from "@/components/dashboard/settings/password-section"
import { ProfileSection } from "@/components/dashboard/settings/profile-section"
import { RoleSection } from "@/components/dashboard/settings/role-section"

type SettingsContentProps = {
  role: "seeker" | "recruiter"
  name: string
  email: string
}

// One settings page shape for both roles; no state here
export function SettingsContent({ role, name, email }: SettingsContentProps) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account details.
        </p>
      </header>
      <ProfileSection name={name} email={email} />
      <PasswordSection />
      <RoleSection currentRole={role} />
    </div>
  )
}
