import { apiRequest } from "@/lib/api"
import type {
  ProfessionalProfile,
} from "@/components/dashboard/seeker/settings/types"

export type SeekerProfileData = ProfessionalProfile & {
  name: string
  email: string
  image: string | null
  phone: string
  city: string
  country: string
}

export type PersonalProfilePayload = {
  name: string
  phone: string
  city: string
  country: string
}

export async function fetchSeekerProfile(): Promise<SeekerProfileData | null> {
  const res = await apiRequest("/api/account/profile")
  const payload = res.data as { profile?: SeekerProfileData } | null
  if (res.status === 200 && payload?.profile) {
    return payload.profile
  }
  return null
}

export async function savePersonalProfile(
  payload: PersonalProfilePayload
): Promise<{ ok: boolean; personal?: PersonalProfilePayload; error?: string }> {
  const res = await apiRequest("/api/account/profile/personal", {
    method: "PUT",
    body: payload,
  })
  const data = res.data as {
    personal?: PersonalProfilePayload
    error?: string
  } | null

  if (res.status === 200 && data?.personal) {
    return { ok: true, personal: data.personal }
  }
  if (res.status === 429) {
    return {
      ok: false,
      error: "Too many update requests. Please wait a moment and try again.",
    }
  }
  return {
    ok: false,
    error: data?.error || "Could not update personal information.",
  }
}

export async function saveProfessionalProfile(
  payload: ProfessionalProfile
): Promise<{ ok: boolean; professional?: ProfessionalProfile; error?: string }> {
  const res = await apiRequest("/api/account/profile/professional", {
    method: "PUT",
    body: payload,
  })
  const data = res.data as {
    professional?: ProfessionalProfile
    error?: string
  } | null

  if (res.status === 200 && data?.professional) {
    return { ok: true, professional: data.professional }
  }
  if (res.status === 429) {
    return {
      ok: false,
      error: "Too many update requests. Please wait a moment and try again.",
    }
  }
  return {
    ok: false,
    error: data?.error || "Could not save professional details.",
  }
}

export async function uploadProfileAvatar(
  file: File
): Promise<{ ok: boolean; imageUrl?: string; error?: string }> {
  const formData = new FormData()
  formData.append("image", file)

  try {
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData,
    })

    const data = (await res.json().catch(() => null)) as {
      imageUrl?: string
      error?: string
    } | null

    if (res.ok && data?.imageUrl) {
      return { ok: true, imageUrl: data.imageUrl }
    }

    return {
      ok: false,
      error: data?.error || "Failed to upload profile image.",
    }
  } catch {
    return {
      ok: false,
      error: "Network error while uploading profile image.",
    }
  }
}
