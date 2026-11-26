import { ExternalLinkIcon } from "lucide-react"

import type { ProjectEntry } from "@/components/dashboard/seeker/settings/types"

type ProfileProjectsProps = {
  projects: ProjectEntry[]
}

export function ProfileProjects({ projects }: ProfileProjectsProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">Projects</h2>
      {projects.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No projects listed yet.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-2 py-4 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {proj.name}
                </h3>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <span>View Project</span>
                    <ExternalLinkIcon aria-hidden className="size-3" />
                  </a>
                )}
              </div>
              {proj.description && (
                <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                  {proj.description}
                </p>
              )}
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-secondary px-2 py-0.5 text-[11px] text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
