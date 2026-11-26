import type { ExperienceEntry } from "@/components/dashboard/seeker/settings/types"

type ProfileExperienceProps = {
  experience: ExperienceEntry[]
}

function calculateDuration(startDate: string, endDate: string) {
  const [startYear, startMonth] = startDate.split("-").map(Number)
  const [endYear, endMonth] = endDate.split("-").map(Number)

  if (
    !startYear ||
    !startMonth ||
    !endYear ||
    !endMonth ||
    startMonth < 1 ||
    startMonth > 12 ||
    endMonth < 1 ||
    endMonth > 12
  ) {
    return null
  }

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1

  if (totalMonths <= 0) return null

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`)
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`)
  }

  return parts.join(", ")
}

export function ProfileExperience({ experience }: ProfileExperienceProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Experience</h2>

      {experience.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No work experience listed yet.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {experience.map((exp) => {
            const endDate = exp.currentlyWorking
              ? new Date()
              : new Date(exp.endDate)

            const duration =
              exp.startDate && endDate
                ? calculateDuration(exp.startDate, endDate.toISOString())
                : null

            return (
              <div key={exp.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    {exp.jobTitle}
                  </h3>

                  <div className="flex flex-col items-start gap-1 text-xs text-muted-foreground">
                    <span>
                      {exp.startDate || "Start"} —{" "}
                      {exp.currentlyWorking ? "Present" : exp.endDate || "End"}
                    </span>

                    {duration && (
                      <span className="font-medium text-foreground/80">
                        {duration}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-0.5 text-xs font-medium text-primary">
                  {exp.company}
                  {exp.employmentType ? ` · ${exp.employmentType}` : ""}
                </p>

                {exp.location && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {exp.location}
                  </p>
                )}

                {exp.description && (
                  <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
