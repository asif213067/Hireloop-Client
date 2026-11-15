"use client"

import type { LucideIcon } from "lucide-react"
import { ChevronDownIcon, GlobeIcon } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "cn"

// Shared sizing: inputs and selects sit at 44px minimum for touch targets
const controlClass =
  "h-11 w-full rounded-lg border border-border bg-input/30 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50"
const labelClass = "text-sm font-medium text-foreground"
const requiredClass = "text-xs font-normal text-muted-foreground"
const errorClass = "mt-1 text-xs text-destructive"

type FieldShellProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
  error?: string
}

// Label row above the control, with the field error underneath
function FieldShell({ id, label, required, hint, children, error }: FieldShellProps) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className={labelClass}>
          {label} {required ? <span className={requiredClass}>(required)</span> : null}
        </label>
        {hint ? <span className={requiredClass}>{hint}</span> : null}
      </div>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={errorId} className={errorClass}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

type JobTextFieldProps = {
  id: string
  label: string
  required?: boolean
  hint?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  icon?: LucideIcon
  prefix?: string
  type?: "text" | "date" | "number"
}

// Single-line input with optional leading icon or prefix
export function JobTextField({
  id,
  label,
  required,
  hint,
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  prefix,
  type = "text",
}: JobTextFieldProps) {
  const describedBy = [hint ? `${id}-hint` : undefined, error ? `${id}-error` : undefined]
    .filter(Boolean)
    .join(" ")

  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error}>
      <div className="relative">
        {Icon ? (
          <Icon aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        ) : null}
        {prefix ? (
          <span aria-hidden className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(controlClass, Icon || prefix ? "pl-9" : undefined)}
        />
      </div>
    </FieldShell>
  )
}

type JobSelectFieldProps = {
  id: string
  label: string
  required?: boolean
  placeholder: string
  value: string
  onChange: (value: string) => void
  error?: string
  options: readonly { value: string; label: string }[]
}

// Native select styled with tokens and a trailing chevron
export function JobSelectField({
  id,
  label,
  required,
  placeholder,
  value,
  onChange,
  error,
  options,
}: JobSelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            controlClass,
            "appearance-none pr-9",
            value === "" ? "text-muted-foreground" : undefined
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-popover text-popover-foreground">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </FieldShell>
  )
}

type JobTextareaFieldProps = {
  id: string
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

// Multi-line input for the long-form sections
export function JobTextareaField({
  id,
  label,
  required,
  placeholder,
  value,
  onChange,
  error,
}: JobTextareaFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <textarea
        id={id}
        name={id}
        rows={5}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, "h-auto py-2.5")}
      />
    </FieldShell>
  )
}

type JobTypeRadioGroupProps = {
  legend: string
  required?: boolean
  value: string
  onChange: (value: string) => void
  error?: string
  options: readonly { value: string; label: string }[]
}

// Segmented radio group: one row from sm up, two rows on phones
export function JobTypeRadioGroup({
  legend,
  required,
  value,
  onChange,
  error,
  options,
}: JobTypeRadioGroupProps) {
  const fieldsetDescribedBy = error ? "job-type-error" : undefined

  return (
    <fieldset aria-describedby={fieldsetDescribedBy} className="min-w-0">
      <legend className={labelClass}>
        {legend} {required ? <span className={requiredClass}>(required)</span> : null}
      </legend>
      <div className="mt-1.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "relative flex h-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-input/30 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground",
              "has-checked:border-primary has-checked:bg-primary/10 has-checked:text-foreground",
              "has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
            )}
          >
            <input
              type="radio"
              name="jobType"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error ? (
        <p id="job-type-error" className={errorClass}>
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}

type RemoteSwitchFieldProps = {
  id: string
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

// Switch as a styled checkbox; role="switch" keeps it announced correctly
export function RemoteSwitchField({ id, label, description, checked, onChange }: RemoteSwitchFieldProps) {
  const describedBy = `${id}-description`

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-input/30 px-4 py-3">
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
          <GlobeIcon aria-hidden className="size-4 text-muted-foreground" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          <span id={describedBy} className="block text-xs text-muted-foreground">
            {description}
          </span>
        </span>
      </span>
      <input
        id={id}
        name={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={describedBy}
        className={cn(
          "relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-muted transition-colors outline-none",
          "checked:border-primary checked:bg-primary",
          "focus-visible:ring-3 focus-visible:ring-ring/50",
          "before:absolute before:top-1/2 before:left-0.5 before:h-4.5 before:w-4.5 before:-translate-y-1/2 before:rounded-full before:bg-background before:transition-transform before:content-[''] checked:before:translate-x-5"
        )}
      />
    </div>
  )
}

type SectionCardProps = {
  index: number
  title: string
  children: ReactNode
}

// Numbered dark card with the violet dot, one per form section
export function SectionCard({ index, title, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <h2 className="flex items-center gap-2.5 text-base font-semibold text-foreground">
        <span aria-hidden className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary" />
          {index}.
        </span>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}
