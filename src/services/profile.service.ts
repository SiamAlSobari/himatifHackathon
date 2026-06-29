import userRepository from "@/repositories/user.repository";
import screeningRepository from "@/repositories/screening.repository";
import appointmentRepository from "@/repositories/appointment.repository";
import screeningService from "./screening.service";
import { ConsultationHistoryItem } from "@/lib/types/profile";

export class ProfileService {
  async getProfileData(userId: string) {
    const user = await userRepository.getUserProfile(userId);
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const hasScreenedToday = await screeningService.checkDailyScreeningStatus(userId);

    // 1. Fetch appointments & format to ConsultationHistoryItem
    const appointments = await appointmentRepository.getUserAppointments(userId, 10);
    const consultationHistory: ConsultationHistoryItem[] = appointments.map((appt) => {
      const psychName = appt.psychologistProfile?.user?.name || "Psikolog Mitra";
      
      // Generate initials for avatar placeholder
      const initials = psychName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      // Date formatting
      const date = new Date(appt.scheduledAt);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
      const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

      // Status translation/mapping
      let status: "Selesai" | "Dibatalkan" | "Berlangsung" = "Berlangsung";
      if (appt.status === "COMPLETED") {
        status = "Selesai";
      } else if (appt.status === "CANCELLED" || appt.status === "DECLINED") {
        status = "Dibatalkan";
      }

      return {
        id: appt.id,
        psychologistName: psychName,
        psychologistInitials: initials,
        date: formattedDate,
        status,
      };
    });

    // 2. Fetch Screening history for trends (Mood & Wellness over last 7 entries)
    const screenings = await screeningRepository.getScreeningsByUserId(userId, 10);
    
    // Sort oldest to newest for chronological graph
    const sortedScreenings = [...screenings].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    const wellnessTrends = sortedScreenings.map((s) => {
      const date = new Date(s.createdAt);
      const day = date.toLocaleDateString("id-ID", { weekday: "short" });
      const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
      
      // Calculate wellness score (higher is better, max score in DASS/screening is 21)
      const wellnessScore = Math.max(0, Math.min(100, Math.round(((21 - s.score) / 21) * 100)));

      return {
        day: `${day} (${dateStr})`,
        score: s.score,
        wellnessScore,
        rawDate: s.createdAt,
      };
    });

    // Calculate metrics
    const totalConsultations = await appointmentRepository.getAppointmentCount(userId);
    
    let averageWellness = 0;
    if (screenings.length > 0) {
      const totalScore = screenings.reduce((sum, s) => sum + s.score, 0);
      const avgScore = totalScore / screenings.length;
      averageWellness = Math.max(0, Math.min(100, Math.round(((21 - avgScore) / 21) * 100)));
    }

    // Latest screening details (Anxiety/Stress categories)
    let latestCondition = "Belum Screening";
    if (screenings.length > 0) {
      const latest = screenings[0];
      if (latest.score <= 5) latestCondition = "Sangat Baik 🌤️";
      else if (latest.score <= 10) latestCondition = "Cukup Stabil 🌥️";
      else if (latest.score <= 15) latestCondition = "Perlu Perhatian 🌧️";
      else latestCondition = "Krisis/Sangat Lelah ⛈️";
    }

    return {
      dbUser: {
        name: user.name || user.email || "Pengguna",
        image: user.image,
        email: user.email,
        usia: user.usia,
        jenisKelamin: user.jenisKelamin,
        kontakDarurat: user.kontakDarurat,
      },
      isOnboarded: user.isOnboarded,
      hasScreenedToday,
      consultationHistory,
      wellnessTrends,
      metrics: {
        totalConsultations,
        averageWellness,
        latestCondition,
      }
    };
  }

  async updateUserProfile(userId: string, data: { name?: string; usia?: number | string; jenisKelamin?: string; image?: string }) {
    const updatedData: any = {};
    if (data.name !== undefined) updatedData.name = data.name;
    if (data.usia !== undefined) updatedData.usia = typeof data.usia === "string" ? parseInt(data.usia, 10) : data.usia;
    if (data.jenisKelamin !== undefined) updatedData.jenisKelamin = data.jenisKelamin;
    if (data.image !== undefined) updatedData.image = data.image;

    return await userRepository.updateUserProfile(userId, updatedData);
  }

  async updateUserPhoneNumber(userId: string, phoneNumber: string) {
    return await userRepository.updateUserProfile(userId, {
      kontakDarurat: phoneNumber,
    });
  }
}

const profileService = new ProfileService();
export default profileService;
