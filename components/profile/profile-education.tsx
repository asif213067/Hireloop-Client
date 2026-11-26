import type { EducationEntry } from "@/components/dashboard/seeker/settings/types"

type ProfileEducationProps = {
  education: EducationEntry[]
}

export function ProfileEducation({ education }: ProfileEducationProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Education</h2>
      {education.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No education listed yet.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {education.map((edu) => (
            <div key={edu.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  {edu.institution}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {edu.startDate || "Start"} — {edu.endDate || "End"}
                </span>
              </div>
              <p className="mt-0.5 text-xs font-medium text-primary">
                {edu.degree}
                {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
              </p>
              {edu.description && (
                <p className="mt-2 text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
