import { redirect } from "next/navigation";
import { auth } from "@/auth";
import psychologistService from "@/services/psychologist.service";
import PsychologistKonsultasiClient from "./konsultasi-client";
import { db } from "@/lib/db";

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
  if (!session?.user?.id || (session.user as any).role !== "PSYCHOLOGY") {
    redirect("/psikolog/login?callbackUrl=/psikolog/konsultasi");
  }

  // Get the psychologist profile using session user id
  const psychProfile = await psychologistService.getPsychologistProfileByUserId(session.user.id);
  if (!psychProfile) {
    redirect("/psikolog/login");
  }

  const { appointmentId } = await searchParams;

  // Fetch appointment
  let activeAppointment = null;
  if (appointmentId) {
    activeAppointment = await db.appointment.findFirst({
      where: {
        id: appointmentId,
        psychologistId: psychProfile.id,
      },
      include: {
        user: true,
        psychologistProfile: {
          include: {
            user: true,
          },
        },
      },
    });
  } else {
    // If no appointmentId provided, grab the nearest scheduled appointment for this psychologist
    activeAppointment = await db.appointment.findFirst({
      where: {
        psychologistId: psychProfile.id,
        status: "SCHEDULED",
      },
      include: {
        user: true,
        psychologistProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  if (!activeAppointment) {
    // No active appointment found
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-slate-400">chat_bubble</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Tidak Ada Sesi Aktif</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Tidak ditemukan sesi konsultasi yang sedang aktif atau terjadwal untuk Anda saat ini. Silakan kembali ke dashboard utama.
          </p>
          <a
            href="/psikolog"
            className="px-6 py-2.5 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-block"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  const clientUser = activeAppointment.user;

  // Fetch context of the patient/client
  const latestScreening = await psychologistService.getLatestScreening(clientUser.id);
  const finalConclusion = await psychologistService.getLatestAiSessionConclusion(clientUser.id);

  const clientProfile = {
    id: clientUser.id,
    name: clientUser.name || clientUser.email || "Klien",
    image: clientUser.image || undefined,
    email: clientUser.email,
    usia: clientUser.usia,
    jenisKelamin: clientUser.jenisKelamin,
  };

  return (
    <PsychologistKonsultasiClient
      activeAppointment={{
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
      }}
      client={clientProfile}
      latestScreeningScore={latestScreening?.score || null}
      finalConclusion={finalConclusion}
      psychologistUser={{
        name: psychProfile.user.name || "Psikolog",
        image: psychProfile.imageUrl,
      }}
    />
  );
}
