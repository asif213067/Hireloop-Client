type PasswordRule = {
  id: string
  label: string
  test: (password: string) => boolean
}

// Single source of truth: the sign-up checklist and the server hook both read this
export const passwordRules: readonly PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "One special character (e.g. @ # !)",
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
]

export function isPasswordValid(password: string) {
  return passwordRules.every((rule) => rule.test(password))
}
