import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { SignOutButton } from "@/components/auth/sign-out-button"
import { UserAvatar } from "@/components/shared/user-avatar"
import { auth } from "@/lib/auth"
import { getProfileHref } from "@/lib/roles"

export const metadata: Metadata = {
  title: "Seeker profile",
  robots: { index: false, follow: false },
}

export default async function SeekerProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) redirect("/signin")

  // Recruiters belong on their own page; every other role lands here
  if (session.user.role === "recruiter") redirect(getProfileHref("recruiter"))

  return (
    <section className="flex min-h-[calc(100dvh-5rem)] items-start justify-center px-4 py-10 sm:items-center sm:py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card/70 p-6 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
        <UserAvatar
          name={session.user.name}
          image={session.user.image}
          className="mx-auto size-20"
        />
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Seeker profile
        </h1>
        <p className="mt-1 text-base font-medium">{session.user.name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {session.user.email}
        </p>
        <p className="mt-3 text-sm capitalize text-muted-foreground">
          {session.user.role ?? "seeker"}
        </p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </div>
    </section>
  )
}
