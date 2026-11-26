"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { uploadProfileAvatar } from "@/lib/profile-api"

type AvatarUploaderProps = {
  name: string
  image: string | null
  onUploaded: (imageUrl: string) => void
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
])

export function AvatarUploader({
  name,
  image,
  onUploaded,
}: AvatarUploaderProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(image)
  const [uploading, setUploading] = useState(false)

  function handleButtonClick() {
    if (uploading) return
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      toast.error("Only JPG, PNG, GIF, and WebP images are allowed.")
      return
    }

    if (file.size <= 0 || file.size > MAX_AVATAR_BYTES) {
      toast.error("Image size must be 5MB or less.")
      return
    }

    const previousUrl = avatarUrl
    const previewUrl = URL.createObjectURL(file)
    setAvatarUrl(previewUrl)
    setUploading(true)

    try {
      const result = await uploadProfileAvatar(file)
      if (!result.ok || !result.imageUrl) {
        setAvatarUrl(previousUrl)
        toast.error(result.error || "Failed to upload profile image.")
        return
      }

      setAvatarUrl(result.imageUrl)
      onUploaded(result.imageUrl)
      toast.success("Profile image updated")
      router.refresh()
    } finally {
      URL.revokeObjectURL(previewUrl)
      setUploading(false)
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center gap-4">
      <UserAvatar
        name={name}
        image={avatarUrl}
        className="size-16 text-lg"
      />
      <div className="space-y-1.5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={uploading}
          className="h-9 rounded-lg border-border bg-background/60 px-3.5 text-xs font-medium"
        >
          {uploading ? "Uploading..." : "Update Profile Image"}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, GIF, PNG or WebP. Max size of 5MB.
        </p>
      </div>
    </div>
  )
}
