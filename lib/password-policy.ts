type PasswordRule = {
  id: string
  label: string
  test: (password: string) => boolean
}

// Single source of truth: the sign-up checklist and the server hook both read this
export const passwordRules: readonly PasswordRule[] = [
  {
    id: "length",
    label: "8+ characters",
    test: (password) => password.length >= 8,
  },
  {
    id: "uppercase",
    label: "1 uppercase",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "1 number",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "1 symbol (e.g. @ # !)",
    test: (password) => /[^A-Za-z0-9\s]/.test(password),
  },
]

export function isPasswordValid(password: string) {
  return passwordRules.every((rule) => rule.test(password))
}
