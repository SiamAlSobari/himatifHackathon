"use server"

import bcrypt from "bcrypt"
import { db } from "@/lib/db"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nama = formData.get("nama") as string
  const usiaStr = formData.get("usia") as string
  const jenisKelamin = formData.get("jenisKelamin") as string

  if (!email || !password || !nama) {
    return { error: "Email, password, dan nama wajib diisi" }
  }

  if (password.length < 6) {
    return { error: "Password minimal 6 karakter" }
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "Email sudah terdaftar" }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const usia = usiaStr ? parseInt(usiaStr) : null

  await db.user.create({
    data: {
      email,
      passwordHash,
      nama,
      name: nama,
      usia,
      jenisKelamin: jenisKelamin || null,
    },
  })

  return { success: true }
}
