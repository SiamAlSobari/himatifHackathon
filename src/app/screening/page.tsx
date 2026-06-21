import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import ScreeningClient from "./screening-client"

export const metadata = {
  title: "Screening • Verimind",
  description:
    "Kenali kondisi emosionalmu. Screening singkat ± 60 detik, 100% privat.",
}

export default async function ScreeningPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/screening")
  }

  // Guard: harus sudah onboarding profile
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, usia: true, jenisKelamin: true, isOnboarded: true },
  })

  if (!user?.usia || !user?.jenisKelamin) {
    redirect("/onboarding")
  }

  // Cek jika sudah screening hari ini (cooldown)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const screeningToday = await db.screening.findFirst({
    where: {
      userId: session.user.id,
      createdAt: {
        gte: startOfToday,
      },
    },
  })

  const latestScreening = await db.screening.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <ScreeningClient
      isOnboarded={user.isOnboarded}
      alreadyScreenedToday={!!screeningToday}
      latestScreening={latestScreening ? {
        score: latestScreening.score,
        createdAt: latestScreening.createdAt.toISOString(),
        type: latestScreening.type,
      } : null}
      userProfile={{
        name: user.name || user.email || "Pengguna",
        usia: user.usia,
        jenisKelamin: user.jenisKelamin,
      }}
    />
  )
}
