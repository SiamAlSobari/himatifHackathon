import psychologistRepository from "@/repositories/psychologist.repository";
import type {
  PsychologistProfileData,
  PsychologistConsultationHistoryItem,
  PsychologistConsultationTrendItem,
  UpdatePsychologistProfilePayload,
} from "@/lib/types/psychologist-profile";

class PsychologistProfileService {
  async getPsychologistProfileData(userId: string): Promise<PsychologistProfileData> {
    const profileRecord = await psychologistRepository.getPsychologistProfileByUserId(userId);
    if (!profileRecord) {
      throw new Error("Profil psikolog tidak ditemukan");
    }

    const { user, ...profileDetails } = profileRecord;

    // ── Consultation history ─────────────────────────────────────────────────
    const appointments = await psychologistRepository.getAppointmentsByPsychologistProfileId(
      profileRecord.id
    );

    const consultationHistory: PsychologistConsultationHistoryItem[] = appointments.map((appt) => {
      const clientName = appt.user.name || appt.user.email || "Klien";
      const initials = clientName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const d = new Date(appt.scheduledAt);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const date = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

      const status: PsychologistConsultationHistoryItem["status"] =
        appt.status === "COMPLETED" ? "Selesai" :
        appt.status === "CANCELLED" || appt.status === "DECLINED" ? "Dibatalkan" :
        appt.status === "EXPIRED" ? "Kadaluwarsa" : "Dijadwalkan";

      return { id: appt.id, clientName, clientInitials: initials, date, status };
    });

    // ── Session trend (last 7 days) ─────────────────────────────────────────
    const now = new Date();
    const dayLabels = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const sessionTrends: PsychologistConsultationTrendItem[] = [];

    for (let i = 6; i >= 0; i--) {
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const targetStr = target.toDateString();

      const sessionCount = appointments.filter((a) =>
        new Date(a.scheduledAt).toDateString() === targetStr &&
        (a.status === "COMPLETED" || a.status === "APPROVED" || a.status === "SCHEDULED")
      ).length;

      const label = `${dayLabels[target.getDay()]} (${target.getDate()}/${target.getMonth() + 1})`;
      sessionTrends.push({ day: label, sessionCount });
    }

    // ── Metrics ───────────────────────────────────────────────────────────────
    const totalSessionsHandled = appointments.length;
    const completedSessions = appointments.filter((a) => a.status === "COMPLETED").length;

    return {
      user: {
        name: user.name || user.email || "Psikolog",
        email: user.email || "",
        image: profileRecord.imageUrl || user.image,
        kontakDarurat: (user as any).kontakDarurat ?? null,
      },
      profile: {
        id: profileRecord.id,
        role: profileRecord.role,
        specialty: profileRecord.specialty,
        rating: profileRecord.rating,
        experienceYears: profileRecord.experienceYears,
        imageUrl: profileRecord.imageUrl,
        availability: profileRecord.availability,
        tags: profileRecord.tags,
        operationalHours: profileRecord.operationalHours ?? [],
      },
      consultationHistory,
      sessionTrends,
      metrics: {
        totalSessionsHandled,
        completedSessions,
        rating: profileRecord.rating,
        experienceYears: profileRecord.experienceYears,
      },
    };
  }

  async updatePsychologistProfile(
    userId: string,
    payload: UpdatePsychologistProfilePayload
  ): Promise<void> {
    await psychologistRepository.updatePsychologistProfileDetails(userId, {
      name: payload.name,
      roleTitle: payload.roleTitle,
      specialty: payload.specialty,
      experienceYears: payload.experienceYears,
    });
  }

  async updateContactNumber(userId: string, kontakDarurat: string): Promise<void> {
    await psychologistRepository.updatePsychologistProfileDetails(userId, { kontakDarurat });
  }
}

const psychologistProfileService = new PsychologistProfileService();
export default psychologistProfileService;
