import { ExternalLinkIcon } from "lucide-react"

import type { ProfessionalLinks } from "@/components/dashboard/seeker/settings/types"

type ProfileLinksProps = {
  links: ProfessionalLinks
}

export function ProfileLinks({ links }: ProfileLinksProps) {
  const items = [
    { label: "Portfolio", url: links.portfolioUrl },
    { label: "LinkedIn", url: links.linkedinUrl },
    { label: "GitHub", url: links.githubUrl },
    { label: "Other", url: links.otherUrl },
  ].filter((item) => item.url.trim() !== "")

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">
        Portfolio & Links
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No external links provided yet.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <span>{item.label}</span>
                <ExternalLinkIcon aria-hidden className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
