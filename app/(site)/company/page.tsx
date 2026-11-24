import type { Metadata } from "next"
import Link from "next/link"
import {
  BriefcaseIcon,
  Building2Icon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "About Company",
  description:
    "Learn about HireLoop, our mission, and how we connect top talent with industry-leading companies worldwide.",
  alternates: { canonical: "/company" },
}

const stats = [
  { value: "50,000+", label: "Curated Job Openings" },
  { value: "12,000+", label: "Verified Companies" },
  { value: "2M+", label: "Active Job Seekers" },
  { value: "97%", label: "Satisfaction Rate" },
]

const values = [
  {
    title: "Verified Opportunities",
    description:
      "Every employer and job posting undergoes verification to ensure genuine, trustworthy career paths for candidates.",
  },
  {
    title: "Seamless Matching",
    description:
      "Advanced filtering, weighted search, and role-driven dashboards remove friction between hiring teams and job seekers.",
  },
  {
    title: "Candidate-Centric Experience",
    description:
      "Track your complete hiring lifecycle with real-time status updates, saved job deadlines, and application history.",
  },
]

export default function CompanyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
      {/* Hero section */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1 text-xs font-medium text-foreground">
          
          <span>About HireLoop</span>
        </div>

        <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Connecting ambitious talent with world-class companies
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          HireLoop was built to streamline modern hiring. We bridge the gap
          between forward-thinking teams looking for exceptional talent and
          professionals looking to accelerate their careers.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-lg px-6 text-sm font-semibold"
            )}
          >
            Explore Open Roles
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-lg px-6 text-sm font-semibold"
            )}
          >
            Post a Job
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mt-16 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-4 sm:p-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Our mission is to make the hiring process transparent, fair, and
            efficient. We eliminate unnecessary roadblocks in job hunting and
            talent acquisition by providing direct connections, clear compensation
            insights, and real-time application tracking.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-foreground/90">
            <li className="flex items-center gap-2">
              <CheckCircle2Icon aria-hidden className="size-4 text-primary" />
              <span>Direct communication between candidates and recruiters</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon aria-hidden className="size-4 text-primary" />
              <span>Transparent salary expectations and work arrangements</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon aria-hidden className="size-4 text-primary" />
              <span>Zero clutter or low-quality scraped postings</span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground">Built For Teams of All Sizes</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            From high-growth tech startups to established global enterprises,
            HireLoop gives hiring teams the tools to publish position specifications,
            reach qualified applicants, and manage recruitment lifecycles with ease.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-foreground/90">
            <li className="flex items-center gap-2">
              <CheckCircle2Icon aria-hidden className="size-4 text-primary" />
              <span>Verified employer badges that build applicant trust</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon aria-hidden className="size-4 text-primary" />
              <span>Integrated application metrics and candidate tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon aria-hidden className="size-4 text-primary" />
              <span>Automated applicant deadline and status management</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Values */}
      <div className="mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Why Professionals Choose HireLoop
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Our principles guide how we design and build every feature.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 rounded-2xl border border-border bg-card/60 p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-foreground">
          Ready to take the next step in your career?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Create an account in minutes or browse active opportunities across tech,
          design, product, engineering, and more.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/jobs"
            className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-lg px-6")}
          >
            Browse Open Jobs
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-lg px-6"
            )}
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  )
}
