import { redirect } from "next/navigation";
import { auth } from "@/auth";
import psychologistService from "@/services/psychologist.service";
import KonsultasiClient from "./konsultasi-client";

export const metadata = {
  title: "Sesi Konsultasi - Jembatan Aman",
  description: "Halaman sesi konsultasi interaktif dengan psikolog profesional Anda.",
};

interface SearchParams {
  appointmentId?: string;
}

export default async function KonsultasiPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/konsultasi");
  }

  const { appointmentId } = await searchParams;

  // Fetch active appointment for the user from database (specific or active)
  const activeAppointment = appointmentId
    ? await psychologistService.getAppointmentById(appointmentId, session.user.id)
    : await psychologistService.getActiveAppointment(session.user.id);

  // Fetch latest screening context for score rendering
  const latestScreening = await psychologistService.getLatestScreening(session.user.id);

  const userProfile = {
    id: session.user.id,
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
