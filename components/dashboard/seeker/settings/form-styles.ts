export const labelClass = "mb-1.5 block text-sm font-medium text-foreground"

export const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background/60 px-3 text-sm text-foreground placeholder:text-muted-foreground"

export const textareaClass =
  "min-h-24 w-full rounded-lg border border-border bg-background/60 p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

export const cardClass = "rounded-xl border border-border bg-card p-5 sm:p-6"

export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}
