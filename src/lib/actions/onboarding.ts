"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type OnboardingPayload = {
  usia: number
  jenisKelamin: string
  kontakDarurat?: string | null
}

export type OnboardingState = {
  success: boolean
  error?: string
  message?: string
  isComplete?: boolean
}

export async function saveOnboardingProfile(
  payload: OnboardingPayload
): Promise<OnboardingState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Sesi tidak valid. Silakan masuk lagi." }
  }

  const { usia, jenisKelamin, kontakDarurat } = payload

  if (!usia || usia < 10 || usia > 100) {
    return { success: false, error: "Usia harus antara 10 - 100 tahun." }
  }

  if (!jenisKelamin) {
    return { success: false, error: "Pilih jenis kelamin terlebih dahulu." }
  }

  try {
    const updated = await db.user.update({
      where: { id: session.user.id },
      data: {
        usia: Number(usia),
        jenisKelamin,
        kontakDarurat: kontakDarurat?.trim() || null,
      },
    })

    revalidatePath("/onboarding")
    revalidatePath("/screening")
    revalidatePath("/dashboard")

    return {
      success: true,
      message: "Profil berhasil disimpan",
      isComplete: !!updated.usia && !!updated.jenisKelamin,
    }
  } catch (error) {
    console.error("[saveOnboardingProfile] error:", error)
    return {
      success: false,
      error: "Gagal menyimpan profil. Coba lagi ya.",
    }
  }
}

export async function getOnboardingStatus(): Promise<{
  isComplete: boolean
}> {
  const session = await auth()
  if (!session?.user?.id) {
    return { isComplete: false }
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { usia: true, jenisKelamin: true },
    })

    const isComplete = !!user?.usia && !!user?.jenisKelamin
    return { isComplete }
  } catch {
    return { isComplete: false }
  }
}
