import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export const metadata = {
  title: "Dashboard Klien",
  description: "Pantau grafik perkembangan mood harian Anda, rekomendasi aktivitas, status konsultasi psikolog, dan riwayat keamanan on-chain.",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard")
  }

  if ((session?.user as any).role === "PSYCHOLOGY") {
    redirect("/psikolog")
  }

  // Guard: harus sudah onboarding dulu sebelum akses dashboard
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { usia: true, jenisKelamin: true },
  })

  if (user && !user?.jenisKelamin || !user?.usia) {
    redirect("/onboarding")
  }

  return <>{children}</>
}
