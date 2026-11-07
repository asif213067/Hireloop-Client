import Image from "next/image"
import { BriefcaseBusinessIcon } from "lucide-react"

import { HeroSearch } from "@/components/landing/hero-search"
import { HeroStats } from "@/components/landing/hero-stats"
import { Reveal } from "@/components/landing/reveal"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
] as const

const stars = [
  { left: "12%", top: "18%", size: 2 },
  { left: "28%", top: "34%", size: 1 },
  { left: "40%", top: "12%", size: 1 },
  { left: "55%", top: "26%", size: 2 },
  { left: "68%", top: "9%", size: 1 },
  { left: "78%", top: "30%", size: 2 },
  { left: "88%", top: "16%", size: 1 },
  { left: "6%", top: "42%", size: 1 },
  { left: "93%", top: "44%", size: 1 },
  { left: "48%", top: "44%", size: 1 },
] as const

function HeroBadge() {
  return (
    <div className="mx-auto flex w-full max-w-md items-center justify-center gap-3">
      <span
        aria-hidden
        className="h-px flex-1 bg-gradient-to-r from-transparent to-border"
      />
      <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 backdrop-blur-sm">
        <span className="flex size-5 items-center justify-center rounded-md bg-highlight/15">
          <BriefcaseBusinessIcon
            aria-hidden
            className="size-3 text-highlight"
          />
        </span>
        <span className="font-mono text-xs font-bold text-foreground">
          50,000+
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase sm:text-xs">
          New jobs this month
        </span>
      </div>
      <span
        aria-hidden
        className="h-px flex-1 bg-gradient-to-l from-transparent to-border"
      />
    </div>
  )
}

function TrendingChips() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
      <span className="text-muted-foreground">Trending Position</span>
      {trendingPositions.map((position) => (
        <span
          key={position}
          className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-secondary-foreground"
        >
          {position}
        </span>
      ))}
    </div>
  )
}

function StarField() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-foreground/50"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pb-8 text-foreground lg:pb-12">
      <StarField />

      <div aria-hidden className="absolute inset-x-0 bottom-0">
        <Image
          src="/images/globe.png"
          alt=""
          width={1440}
          height={1882}
          priority
          className="pointer-events-none mx-auto w-[200%] max-w-[1500px] -translate-y-[16%] [mask-image:radial-gradient(85%_70%_at_50%_55%,black_60%,transparent_98%)] sm:w-[140%] lg:w-full lg:translate-y-0"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 text-center sm:pt-20">
        <Reveal className="w-full">
          <HeroBadge />
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
            Find Your Dream Job Today
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-balance text-muted-foreground sm:text-base">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="mt-8 w-full">
          <HeroSearch />
        </Reveal>

        <Reveal delay={0.32} className="mt-5">
          <TrendingChips />
        </Reveal>

        <p className="mt-24 mb-8 text-xl leading-snug font-medium text-balance text-foreground/70 sm:mt-32 sm:text-2xl lg:mt-40 lg:text-[1.65rem]">
          Assisting over{" "}
          <span className="font-semibold text-foreground">
            15,000 job seekers
          </span>
          <br />
          find their dream positions.
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <HeroStats />
      </div>
    </section>
  )
}
