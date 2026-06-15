"use server"

import bcrypt from "bcrypt"
import { db } from "@/lib/db"

export async function registerPsychologist(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const roleTitle = formData.get("roleTitle") as string
  const specialty = formData.get("specialty") as string
  const experienceYearsRaw = formData.get("experienceYears") as string
  const imageUrl = formData.get("imageUrl") as string
  const tagsRaw = formData.get("tags") as string

  if (!email || !password || !name || !roleTitle || !specialty || !experienceYearsRaw) {
    return { error: "Semua data profil wajib diisi" }
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" }
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Email sudah terdaftar" }
  }

  const experienceYears = parseInt(experienceYearsRaw, 10)
  if (isNaN(experienceYears)) {
    return { error: "Pengalaman tahun harus berupa angka" }
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : []

  const passwordHash = await bcrypt.hash(password, 12)

  try {
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: "PSYCHOLOGY",
        isOnboarded: true,
      },
    })

    await db.psychologistProfile.create({
      data: {
        userId: user.id,
        role: roleTitle,
        specialty,
        rating: 5.0,
        experienceYears,
        imageUrl: imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCm0bcB0lzDcZlnjBA25NjhIN4_C42QMvYjxW33jb2jch1A0EQCRcaSsOQUnjy3rMikDcIowjhdMI910iiO8Mkanuvq4kRKzOGEYhvhpRZWqgMKTvJofZGbb1HCI4eoTv1Vn1qqKHhHo7gkufVpq6AlJorSOFs6fEUSvTqlYiY6ylLJ6PTn8i_qY38_KETmZ0HhV_7RTHSyI3bS_qCgyVjEfrcP-GyBylZacT3cErIG9i_P9NGyFCM6FCtBJVVioI0F3eKMqvM8HA",
        availability: "AVAILABLE",
        tags,
      },
    })

    return { success: true }
  } catch (err: any) {
    console.error("Failed to register psychologist:", err)
    return { error: "Terjadi kesalahan server saat mendaftarkan spesialis: " + err.message }
  }
}
