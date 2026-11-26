type ProfileSkillsProps = {
  skills: string[]
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-foreground">Skills</h2>
      {skills.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No skills listed yet.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-border bg-secondary/70 px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
