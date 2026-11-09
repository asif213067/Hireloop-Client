import { cn } from "@/lib/utils"

type Tone = "neutral" | "danger"

type FooterRowOptions = {
  tone: Tone
  collapsed?: boolean
  sheet?: boolean
}

// Shared look of the sidebar footer rows (Back to site, Sign out)
export function footerRowClasses({
  tone,
  collapsed = false,
  sheet = false,
}: FooterRowOptions) {
  return cn(
    "group flex items-center rounded-lg text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-3",
    tone === "danger"
      ? "hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/40"
      : "hover:bg-accent hover:text-foreground focus-visible:ring-ring/50",
    collapsed
      ? "mx-auto size-10 justify-center"
      : cn("w-full gap-3 px-3", sheet ? "h-11" : "h-10")
  )
}

// Rounded icon tile inside a footer row
export function footerTileClasses(tone: Tone) {
  return cn(
    "grid size-7 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground transition-colors",
    tone === "danger"
      ? "group-hover:bg-destructive/15 group-hover:text-destructive"
      : "group-hover:bg-background/40 group-hover:text-foreground"
  )
}
