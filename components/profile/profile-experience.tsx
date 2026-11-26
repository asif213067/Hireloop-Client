import type { ExperienceEntry } from "@/components/dashboard/seeker/settings/types"

type ProfileExperienceProps = {
  experience: ExperienceEntry[]
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
          {experience.map((exp) => (
            <div key={exp.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {exp.jobTitle}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {exp.startDate || "Start"} —{" "}
                  {exp.currentlyWorking ? "Present" : exp.endDate || "End"}
                </span>
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
          ))}
        </div>
      )}
    </section>
  )
}
