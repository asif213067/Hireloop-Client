import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  imageClassName?: string
  priority?: boolean
}

export function Logo({
  className,
  imageClassName,
  priority = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="HireLoop – home"
      className={cn(
        "inline-flex items-center rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <Image
        src="/images/logo.png"
        alt="HireLoop"
        width={154}
        height={44}
        priority={priority}
        className={cn("h-7 w-auto md:h-8", imageClassName)}
      />
    </Link>
  )
}
