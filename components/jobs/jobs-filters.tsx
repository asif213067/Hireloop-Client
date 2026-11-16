import { JOB_TYPES, type JobType } from "@/lib/jobs"

import { AutoSubmit } from "@/components/jobs/auto-submit"

// Date-posted filter values; the page also validates against this list
export const POSTED_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "1", label: "Last 24 hours" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "older", label: "Older than 30 days" },
] as const

// Sort values for the select in the results header
export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "closing", label: "Closing Soon" },
  { value: "match", label: "Best Match" },
] as const

type JobsFiltersProps = {
  type: string[]
  remote: boolean
  posted: string
  typeCounts: Record<JobType, number>
}

// Row style: 44px minimum on touch screens, visible ring on keyboard focus
const rowClass =
  "flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-2 text-sm text-muted-foreground outline-none hover:bg-accent has-checked:border-primary/40 has-checked:bg-primary/10 has-checked:text-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50"

// Filter panel fed by the current URL values; inputs are uncontrolled
export function JobsFilters({
  type,
  remote,
  posted,
  typeCounts,
}: JobsFiltersProps) {
  return (
    <AutoSubmit>
      <section className="rounded-xl border border-border bg-card p-4">
        <fieldset>
          <legend className="text-sm font-medium text-foreground">
            Job Type
          </legend>
          <div className="mt-1">
            {JOB_TYPES.map((option) => (
              <label key={option.value} className={rowClass}>
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    name="type"
                    value={option.value}
                    defaultChecked={type.includes(option.value)}
                    className="sr-only"
                  />
                  {option.label}
                </span>
                <span className="text-xs">{typeCounts[option.value]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-2 border-t border-border pt-2">
          <legend className="text-sm font-medium text-foreground">
            Work location
          </legend>
          <label className={rowClass}>
            <span>Remote only</span>
            <input
              type="checkbox"
              name="remote"
              value="true"
              role="switch"
              defaultChecked={remote}
              className="relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-muted transition-colors outline-none before:absolute before:top-1/2 before:left-0.5 before:h-4.5 before:w-4.5 before:-translate-y-1/2 before:rounded-full before:bg-background before:transition-transform before:content-[''] checked:border-primary checked:bg-primary checked:before:translate-x-5 focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </fieldset>
        <fieldset className="mt-2 border-t border-border pt-2">
          <legend className="text-sm font-medium text-foreground">
            Date posted
          </legend>
          <div className="mt-1">
            {POSTED_OPTIONS.map((option) => (
              <label key={option.value} className={rowClass}>
                <span className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="posted"
                    value={option.value}
                    defaultChecked={posted === option.value}
                    className="sr-only"
                  />
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>
    </AutoSubmit>
  )
}
