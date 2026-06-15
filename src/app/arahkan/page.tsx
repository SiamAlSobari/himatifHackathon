import { redirect } from "next/navigation"
import { auth } from "@/auth"
import psychologistService from "@/services/psychologist.service"
import { seedPsychologists } from "@/lib/seed"
import ArahkanClient from "./arahkan-client"

export const metadata = {
  title: "Arahkan • Jembatan Aman",
  description: "Temukan pendampingan profesional yang tepat untuk kondisi psikologis Anda.",
}

export default async function ArahkanPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/arahkan")
  }

  // Guard: user profile must exist
  const dbUser = await psychologistService.getUserProfile(session.user.id)

  if (!dbUser?.usia || !dbUser?.jenisKelamin) {
    redirect("/onboarding")
  }

  // Guard: must be onboarded (already completed initial screening)
  if (!dbUser?.isOnboarded) {
    redirect("/screening")
  }

  // Ensure psychologists are seeded in database
  await seedPsychologists()

  // Fetch psychologists
  const psychologists = await psychologistService.getPsychologists()

  // Fetch active scheduled appointment for the user
  const activeAppointment = await psychologistService.getActiveAppointment(session.user.id)

  // Fetch latest screening to show user progress score info
  const latestScreening = await psychologistService.getLatestScreening(session.user.id)

  return (
    <ArahkanClient
      psychologists={psychologists.map((p) => ({
        id: p.id,
        name: p.user.name || "Psikolog",
        role: p.role,
        specialty: p.specialty,
        rating: p.rating,
        experienceYears: p.experienceYears,
        imageUrl: p.imageUrl,
        availability: p.availability,
        busyUntil: p.busyUntil || undefined,
        tags: p.tags,
      }))}
      activeAppointment={activeAppointment ? {
        id: activeAppointment.id,
        scheduledAt: activeAppointment.scheduledAt.toISOString(),
        psychologist: {
          id: activeAppointment.psychologistProfile.id,
          name: activeAppointment.psychologistProfile.user.name || "Psikolog",
          role: activeAppointment.psychologistProfile.role,
          imageUrl: activeAppointment.psychologistProfile.imageUrl,
        }
      } : null}
      userProfile={{
        id: session.user.id,
        name: dbUser.name || dbUser.email || "Pengguna",
        image: dbUser.image || undefined,
      }}
      latestScreeningScore={latestScreening?.score || null}
    />
  )
}

