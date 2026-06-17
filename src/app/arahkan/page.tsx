"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ArahkanClient from "./arahkan-client"
import { useArahkan } from "@/hooks/arahkan/useArahkan"

export default function ArahkanPage() {
  const router = useRouter()
  const { data, isLoading } = useArahkan()

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.dbUser.usia || !data.dbUser.jenisKelamin) {
        router.push("/onboarding")
      } else if (!data.hasScreenedToday) {
        router.push("/screening")
      }
    }
  }, [data, isLoading, router])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#004349] border-t-transparent" />
      </div>
    )
  }

  return (
    <ArahkanClient
      psychologists={data.psychologists}
      activeAppointment={data.activeAppointment}
      userProfile={data.dbUser}
      latestScreeningScore={data.latestScreeningScore}
    />
  )
}
