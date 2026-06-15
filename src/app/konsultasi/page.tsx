import { redirect } from "next/navigation";
import { auth } from "@/auth";
import psychologistService from "@/services/psychologist.service";
import KonsultasiClient from "./konsultasi-client";

export const metadata = {
  title: "Sesi Konsultasi - Jembatan Aman",
  description: "Halaman sesi konsultasi interaktif dengan psikolog profesional Anda.",
};

export default async function KonsultasiPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/konsultasi");
  }

  // Fetch active appointment for the user from database
  const activeAppointment = await psychologistService.getActiveAppointment(session.user.id);

  // Fetch latest screening context for score rendering
  const latestScreening = await psychologistService.getLatestScreening(session.user.id);

  const userProfile = {
    name: session.user.name || session.user.email || "Pengguna",
    image: session.user.image || undefined,
  };

  return (
    <KonsultasiClient
      activeAppointment={
        activeAppointment
          ? {
              id: activeAppointment.id,
              scheduledAt: activeAppointment.scheduledAt.toISOString(),
              psychologist: {
                id: activeAppointment.psychologist.id,
                name: activeAppointment.psychologist.name,
                role: activeAppointment.psychologist.role,
                specialty: activeAppointment.psychologist.specialty,
                imageUrl: activeAppointment.psychologist.imageUrl,
                experienceYears: activeAppointment.psychologist.experienceYears,
                tags: activeAppointment.psychologist.tags,
                strNumber: undefined, // fallback will be used
                practiceLocation: undefined, // fallback will be used
              },
            }
          : null
      }
      userProfile={userProfile}
      latestScreening={
        latestScreening
          ? {
              score: latestScreening.score,
              createdAt: latestScreening.createdAt.toISOString(),
              type: latestScreening.type,
            }
          : null
      }
    />
  );
}
