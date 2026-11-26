import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { db } from "@/lib/auth"
import { getSession } from "@/lib/session"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
])

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Use the ImgBB API key variable documented in .env.example on the server only
  const imgbbApiKey = (process.env.NEXT_PUBLIC_IMGBB_API_KEY || "").trim()
  if (!imgbbApiKey) {
    return NextResponse.json(
      { error: "Image upload service is not configured on the server." },
      { status: 500 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart form data." },
      { status: 400 }
    )
  }

  const file = formData.get("image")
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Please select an image file to upload." },
      { status: 400 }
    )
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, GIF, and WebP images are allowed." },
      { status: 400 }
    )
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image size must be 5MB or less." },
      { status: 400 }
    )
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64Image = buffer.toString("base64")

    const imgbbForm = new URLSearchParams()
    imgbbForm.set("key", imgbbApiKey)
    imgbbForm.set("image", base64Image)

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: imgbbForm.toString(),
    })

    const imgbbPayload = (await imgbbResponse.json().catch(() => null)) as {
      success?: boolean
      data?: { url?: string; display_url?: string }
      error?: { message?: string }
    } | null

    const uploadedUrl =
      imgbbPayload?.data?.display_url || imgbbPayload?.data?.url

    if (!imgbbResponse.ok || !imgbbPayload?.success || !uploadedUrl) {
      return NextResponse.json(
        {
          error:
            imgbbPayload?.error?.message ||
            "Failed to upload image to ImgBB. Please try again.",
        },
        { status: 502 }
      )
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json({ error: "Invalid user session" }, { status: 400 })
    }

    await db.collection("user").updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          image: uploadedUrl,
          updatedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ imageUrl: uploadedUrl })
  } catch {
    return NextResponse.json(
      { error: "Could not process image upload. Please try again." },
      { status: 500 }
    )
  }
}
