type ProfileAboutProps = {
  bio: string
}

export function ProfileAbout({ bio }: ProfileAboutProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-foreground">About</h2>
      {bio.trim() ? (
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {bio}
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          No bio provided yet.
        </p>
      )}
    </section>
  )
}
