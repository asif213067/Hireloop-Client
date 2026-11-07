import { passwordRules } from "@/lib/password-policy"
import { cn } from "@/lib/utils"

type PasswordRulesProps = {
  id: string
  password: string
}

// One-sentence hint: each requirement turns bright and bold once it is met
export function PasswordRules({ id, password }: PasswordRulesProps) {
  return (
    <p id={id} className="mt-1.5 text-xs text-muted-foreground">
      Use{" "}
      {passwordRules.map((rule, index) => {
        const met = rule.test(password)
        const isLast = index === passwordRules.length - 1

        return (
          <span key={rule.id}>
            <span
              className={cn(
                "transition-colors",
                met && "font-semibold text-foreground"
              )}
            >
              {rule.label}
            </span>
            <span className="sr-only">{met ? " (met)" : " (not met)"}</span>
            {isLast ? "." : ", "}
          </span>
        )
      })}
    </p>
  )
}
