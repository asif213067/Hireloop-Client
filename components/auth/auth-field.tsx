"use client"

import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

const labelClass = "mb-1.5 block text-sm font-medium text-foreground"
const inputClass = "h-11 text-base sm:text-sm"

type AuthFieldProps = {
  id: string
  label: string
  type?: "text" | "email"
  autoComplete: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

// Text / email field with a visible label
export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  placeholder,
  value,
  onChange,
}: AuthFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        className={inputClass}
      />
    </div>
  )
}

type PasswordFieldProps = {
  id: string
  autoComplete: "new-password" | "current-password"
  placeholder: string
  value: string
  onChange: (value: string) => void
  minLength?: number
  hint?: string
  describedBy?: string
}

// Password field with show/hide toggle and optional hint
export function PasswordField({
  id,
  autoComplete,
  placeholder,
  value,
  onChange,
  minLength,
  hint,
  describedBy,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const hintId = `${id}-hint`

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        Password
      </label>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          minLength={minLength}
          aria-describedby={hint ? hintId : describedBy}
          required
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {visible ? (
            <EyeOffIcon aria-hidden className="size-4" />
          ) : (
            <EyeIcon aria-hidden className="size-4" />
          )}
        </button>
      </div>
      {hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
