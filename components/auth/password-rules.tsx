import { CheckIcon, CircleIcon } from "lucide-react"

import { passwordRules } from "@/lib/password-policy"
import { cn } from "@/lib/utils"

type PasswordRulesProps = {
  id: string
  password: string
}

// Live checklist: each rule turns on as the user types
export function PasswordRules({ id, password }: PasswordRulesProps) {
  return (
    <ul id={id} className="mt-2 grid gap-1.5 text-xs sm:grid-cols-2">
      {passwordRules.map((rule) => {
        const met = rule.test(password)

        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              met ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {met ? (
              <CheckIcon aria-hidden className="size-3.5 text-primary" />
            ) : (
              <CircleIcon aria-hidden className="size-3.5" />
            )}
            <span>{rule.label}</span>
            <span className="sr-only">{met ? "(met)" : "(not met)"}</span>
          </li>
        )
      })}
    </ul>
  )
}
