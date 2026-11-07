"use client"

import { useState } from "react"
import { MapPinIcon, SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type FieldProps = {
  icon: React.ReactNode
  name: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

function Field({ icon, name, placeholder, value, onChange }: FieldProps) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 transition-colors focus-within:bg-accent/50">
      {icon}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        name={name}
        placeholder={placeholder}
        autoComplete="off"
        className="h-11 border-none bg-transparent px-0 text-sm text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0 dark:bg-transparent"
      />
    </label>
  )
}

export function HeroSearch() {
  const [keywords, setKeywords] = useState("")
  const [location, setLocation] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Search jobs"
      className="mx-auto flex w-full max-w-2xl flex-col gap-1 rounded-xl border border-border bg-card/60 p-1.5 shadow-2xl backdrop-blur-md transition-colors focus-within:border-ring/60 sm:flex-row sm:items-center"
    >
      <Field
        icon={
          <SearchIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        }
        name="keywords"
        placeholder="Job title, skill or company"
        value={keywords}
        onChange={setKeywords}
      />

      <div aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />
      <div aria-hidden className="mx-3 h-px bg-border sm:hidden" />

      <Field
        icon={
          <MapPinIcon
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
        }
        name="location"
        placeholder="Location or Remote"
        value={location}
        onChange={setLocation}
      />

      <Button
        type="submit"
        aria-label="Search jobs"
        className="h-11 w-full sm:size-11 sm:w-11 sm:shrink-0 sm:p-0"
      >
        <SearchIcon aria-hidden className="size-4" />
        <span className="sm:hidden">Search</span>
      </Button>
    </form>
  )
}
