"use client"

import {
  Building2Icon,
  BriefcaseBusinessIcon,
  StarIcon,
  UserSearchIcon,
  type LucideIcon,
} from "lucide-react"
import { MotionConfig, motion, type Variants } from "framer-motion"

type Stat = {
  icon: LucideIcon
  value: string
  label: string
}

const stats: Stat[] = [
  { icon: BriefcaseBusinessIcon, value: "50K", label: "Active Jobs" },
  { icon: Building2Icon, value: "12K", label: "Companies" },
  { icon: UserSearchIcon, value: "2M", label: "Job Seekers" },
  { icon: StarIcon, value: "97%", label: "Satisfaction Rate" },
]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

function StatCard({ stat }: { stat: Stat }) {
  const Icon = stat.icon

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="rounded-xl border border-border bg-card/90 p-4 backdrop-blur-sm sm:p-5"
    >
      <Icon aria-hidden className="size-4 text-muted-foreground" />
      <p className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:mt-10 sm:text-4xl">
        {stat.value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        {stat.label}
      </p>
    </motion.div>
  )
}

export function HeroStats() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </motion.div>
    </MotionConfig>
  )
}
