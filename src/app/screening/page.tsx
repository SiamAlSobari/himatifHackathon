import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import ScreeningClient from "./screening-client"

export const metadata = {
  title: "Screening • Jembatan Aman",
  description:
    "Kenali kondisi emosionalmu. Screening singkat ± 60 detik, 100% privat.",
}

export default async function ScreeningPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/screening")
  }

  // Guard: harus sudah onboarding
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { usia: true, jenisKelamin: true },
  })

  if (!user?.usia || !user?.jenisKelamin) {
    redirect("/onboarding")
  }

  return <ScreeningClient />
}
