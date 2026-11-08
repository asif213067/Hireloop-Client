"use client"

import { cn } from "@/lib/utils"

import { PUBLIC_SIGNUP_ROLES, type PublicSignupRole } from "@/lib/roles"

type RolePickerProps = {
  value: PublicSignupRole
  onChange: (role: PublicSignupRole) => void
  disabled?: boolean
}

// Card copy per role (admin is never on the public list)
const roleCards: Record<PublicSignupRole, { title: string; sub: string }> = {
  seeker: { title: "Job Seeker", sub: "Find and apply for roles" },
  recruiter: { title: "Recruiter", sub: "Post jobs and hire talent" },
}

const cardClass =
  "flex min-h-11 flex-col gap-0.5 rounded-lg border border-input bg-transparent p-3 transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50"

// Accessible radio cards: native inputs stay in the a11y tree
export function RolePicker({
  value,
  onChange,
  disabled = false,
}: RolePickerProps) {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-1.5 block text-sm font-medium text-foreground">
        I am a
      </legend>
      <div className="grid grid-cols-2 gap-3">
        {PUBLIC_SIGNUP_ROLES.map((role) => (
          <label
            key={role}
            className={cn("cursor-pointer", disabled && "cursor-not-allowed")}
          >
            <input
              type="radio"
              name="role"
              value={role}
              checked={value === role}
              onChange={() => onChange(role)}
              disabled={disabled}
              required
              className="sr-only peer"
            />
            <span
              className={cn(
                cardClass,
                disabled && "opacity-50"
              )}
            >
              <span className="text-sm font-medium text-foreground">
                {roleCards[role].title}
              </span>
              <span className="text-xs text-muted-foreground">
                {roleCards[role].sub}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
