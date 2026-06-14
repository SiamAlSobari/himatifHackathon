import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export const metadata = {
  title: "Dashboard • Jembatan Aman",
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

  // Guard: harus sudah onboarding dulu sebelum akses dashboard
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { usia: true, jenisKelamin: true },
  })

  if (!user?.usia || !user?.jenisKelamin) {
    redirect("/onboarding")
  }

  return <>{children}</>
}
