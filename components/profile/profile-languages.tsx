import type { LanguageEntry } from "@/components/dashboard/seeker/settings/types"

type ProfileLanguagesProps = {
  languages: LanguageEntry[]
}

export function ProfileLanguages({ languages }: ProfileLanguagesProps) {
  if (!languages || languages.length === 0) {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">Languages</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {languages.map((lang) => (
          <span
            key={lang.id}
            className="rounded-md border border-border bg-secondary/70 px-2.5 py-1 text-xs font-medium text-foreground"
          >
            {lang.name} —{" "}
            <span className="text-muted-foreground">{lang.proficiency}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
