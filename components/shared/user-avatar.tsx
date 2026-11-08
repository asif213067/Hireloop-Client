"use client"

import { useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type UserAvatarProps = {
  name: string
  image?: string | null
  className?: string
}

// First letter of the first and last word, "?" for an empty name
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  const first = words[0]!.charAt(0)
  const last = words.length > 1 ? words[words.length - 1]!.charAt(0) : ""
  return `${first}${last}`.toUpperCase()
}

// Round avatar: provider image with an initials fallback
export function UserAvatar({ name, image, className }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image) && !imageFailed

  return showImage ? (
    <span className={cn("relative inline-block size-10 rounded-full", className)}>
      <Image
        src={image!}
        alt={name || "Profile"}
        referrerPolicy="no-referrer"
        fill
        unoptimized
        onError={() => setImageFailed(true)}
        className="rounded-full object-cover"
      />
    </span>
  ) : (
    <span
      aria-label={name || "Profile"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary",
        className
      )}
    >
      <span className="text-sm font-semibold">{getInitials(name)}</span>
    </span>
  )
}
