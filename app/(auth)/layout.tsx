// Shared shell for /signin and /signup: centered column with a soft violet glow
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="relative flex min-h-[calc(100dvh-5rem)] items-start justify-center overflow-hidden px-4 py-10 sm:items-center sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent)]"
      />
      <div className="relative w-full max-w-md">{children}</div>
    </section>
  )
}
