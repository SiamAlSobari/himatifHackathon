import { redirect } from "next/navigation";
import { auth } from "@/auth";
import psychologistService from "@/services/psychologist.service";
import PsychologistKonsultasiClient from "./konsultasi-client";

export const metadata = {
  title: "Sesi Konsultasi (Psikolog) - Jembatan Aman",
  description: "Halaman sesi konsultasi interaktif - Sudut Pandang Psikolog.",
};

interface SearchParams {
  appointmentId?: string;
}

export default async function PsychologistKonsultasiPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/psychologist/konsultasi");
  }

  // Fetch logged in user profile (for the hackathon demo, they act as the client)
  const dbUser = await psychologistService.getUserProfile(session.user.id);
  if (!dbUser) {
    redirect("/dashboard");
  }

  const { appointmentId } = await searchParams;

  // Fetch active appointment for the user from database
  const activeAppointment = appointmentId
    ? await psychologistService.getAppointmentById(appointmentId, session.user.id)
    : await psychologistService.getActiveAppointment(session.user.id);

  // Fetch latest screening context for score rendering
  const latestScreening = await psychologistService.getLatestScreening(session.user.id);

  // Fetch the final conclusion of the user's last AI chat session
  const finalConclusion = await psychologistService.getLatestAiSessionConclusion(session.user.id);

  const clientProfile = {
    id: session.user.id,
    name: dbUser.name || dbUser.email || "Pengguna",
    image: dbUser.image || undefined,
    email: dbUser.email,
    usia: dbUser.usia,
    jenisKelamin: dbUser.jenisKelamin,
  };

  return (
    <PsychologistKonsultasiClient
      activeAppointment={
        activeAppointment
          ? {
              id: activeAppointment.id,
              scheduledAt: activeAppointment.scheduledAt.toISOString(),
              psychologist: {
                id: activeAppointment.psychologistProfile.id,
                name: activeAppointment.psychologistProfile.user.name || "Psikolog",
                role: activeAppointment.psychologistProfile.role,
                specialty: activeAppointment.psychologistProfile.specialty,
                imageUrl: activeAppointment.psychologistProfile.imageUrl,
                experienceYears: activeAppointment.psychologistProfile.experienceYears,
                tags: activeAppointment.psychologistProfile.tags,
              },
            }
          : null
      }
      client={clientProfile}
      latestScreeningScore={latestScreening?.score || null}
      finalConclusion={finalConclusion}
    />
  );
}
