import userRepository from "@/repositories/user.repository"
import psychologistRepository from "@/repositories/psychologist.repository"
import screeningRepository from "@/repositories/screening.repository"
import screeningService from "./screening.service"
import { ScreeningResult } from "@/lib/types/dashboardpsikolog"

export class PsychologistService {
  async getUserProfile(id: string) {
    return await userRepository.getUserProfile(id)
  }

  async getPsychologists() {
    return await psychologistRepository.getPsychologists()
  }

  async getActiveAppointment(userId: string) {
    return await psychologistRepository.getActiveAppointment(userId)
  }

  async getAppointmentById(id: string, userId: string) {
    return await psychologistRepository.getAppointmentById(id, userId)
  }

  async getLatestScreening(userId: string) {
    return await screeningRepository.getLatestScreeningResult(userId)
  }

  async bookAppointment(userId: string, psychologistId: string, scheduledAt: Date) {
    // Check if psychologist exists
    const psych = await psychologistRepository.getPsychologistProfileById(psychologistId)

    if (!psych) {
      throw new Error("Psikolog tidak ditemukan")
    }

    // Check if user already booked this specific psychologist today
    const startOfDay = new Date(scheduledAt);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduledAt);
    endOfDay.setHours(23, 59, 59, 999);

    const existingToday = await psychologistRepository.findAppointmentToday(userId, psychologistId, startOfDay, endOfDay);

    if (existingToday) {
      throw new Error("Anda hanya dapat menjadwalkan sesi dengan psikolog ini 1 kali per hari.");
    }

    // Check if user already has an active scheduled appointment
    const existing = await psychologistRepository.findActiveScheduledAppointment(userId)

    if (existing) {
      // Cancel the previous one
      await psychologistRepository.updateAppointmentStatus(existing.id, "CANCELLED")
    }

    // Create new appointment
    return await psychologistRepository.createAppointment(userId, psychologistId, scheduledAt)
  }

  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await psychologistRepository.getAppointmentWithProfile(appointmentId)

    if (
      !appointment ||
      (appointment.userId !== userId && appointment.psychologistProfile.userId !== userId)
    ) {
      throw new Error("Appointment not found or unauthorized")
    }

    return await psychologistRepository.updateAppointmentStatus(appointmentId, "CANCELLED")
  }

  async completeAppointment(appointmentId: string, userId: string) {
    const appointment = await psychologistRepository.getAppointmentWithProfile(appointmentId)

    if (
      !appointment ||
      (appointment.userId !== userId && appointment.psychologistProfile.userId !== userId)
    ) {
      throw new Error("Appointment not found or unauthorized")
    }

    return await psychologistRepository.updateAppointmentStatus(appointmentId, "COMPLETED")
  }

  async getLatestAiSessionConclusion(userId: string): Promise<string | null> {
    const latestCompleted = await psychologistRepository.getLatestCompletedChatSession(userId)

    if (!latestCompleted) return null

    // Find message with finalConclusion in its metaData
    for (const msg of latestCompleted.chatMessages) {
      if (msg.role === "ASSISTANT" && msg.metaData) {
        const meta = msg.metaData as any;
        if (meta.finalConclusion) {
          return meta.finalConclusion;
        }
      }
    }

    return null
  }

  async getOrCreateConsultationMessages(appointmentId: string) {
    return await psychologistRepository.getConsultationMessages(appointmentId);
  }

  async createConsultationMessage(appointmentId: string, sender: "user" | "psychologist", text: string) {
    return await psychologistRepository.createConsultationMessage(appointmentId, sender, text);
  }

  async ratePsychologist(psychologistId: string, userRating: number) {
    const psych = await psychologistRepository.getPsychologistProfileById(psychologistId);
    if (!psych) {
      throw new Error("Psikolog tidak ditemukan");
    }

    // Calculate new rating (assume 9 historical ratings + user rating)
    const newRating = Math.round(((psych.rating * 9 + userRating) / 10) * 10) / 10;

    return await psychologistRepository.updatePsychologistRating(psychologistId, newRating);
  }

  async getPsychologistProfileByUserId(userId: string) {
    return await psychologistRepository.getPsychologistProfileByUserId(userId)
  }

  async registerPsychologist(payload: {
    email: string;
    passwordHash: string;
    name: string;
    roleTitle: string;
    specialty: string;
    experienceYears: number;
    tags: string[];
  }, imageFile?: File | null) {
    // 1. Cek if email exists
    const existing = await userRepository.getUserByEmail(payload.email);
    if (existing) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Upload image to Cloudinary if file provided
    let imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCm0bcB0lzDcZlnjBA25NjhIN4_C42QMvYjxW33jb2jch1A0EQCRcaSsOQUnjy3rMikDcIowjhdMI910iiO8Mkanuvq4kRKzOGEYhvhpRZWqgMKTvJofZGbb1HCI4eoTv1Vn1qqKHhHo7gkufVpq6AlJorSOFs6fEUSvTqlYiY6ylLJ6PTn8i_qY38_KETmZ0HhV_7RTHSyI3bS_qCgyVjEfrcP-GyBylZacT3cErIG9i_P9NGyFCM6FCtBJVVioI0F3eKMqvM8HA";
    if (imageFile) {
      const { uploadToCloudinary } = await import("@/lib/cloudinary");
      imageUrl = await uploadToCloudinary(imageFile, "psychologists");
    }

    // 3. Create user
    const user = await userRepository.createUser({
      email: payload.email,
      passwordHash: payload.passwordHash,
      name: payload.name,
      image: imageUrl,
      role: "PSYCHOLOGY",
      isOnboarded: true,
    });

    // 4. Create psychologist profile
    await psychologistRepository.createPsychologistProfile({
      userId: user.id,
      role: payload.roleTitle,
      specialty: payload.specialty,
      rating: 5.0,
      experienceYears: payload.experienceYears,
      imageUrl,
      availability: "AVAILABLE",
      tags: payload.tags,
    });

    return user;
  }

  async getPsychologistAppointments(profileId: string) {
    return await psychologistRepository.getPsychologistAppointments(profileId)
  }

  async getPsychologistDashboardData(userId: string) {
    // 1. Get psychologist profile
    const profile = await psychologistRepository.getPsychologistProfileByUserId(userId);
    if (!profile) {
      throw new Error("Profil psikolog tidak ditemukan");
    }

    // 2. Get appointments
    const appointments = await psychologistRepository.getPsychologistAppointments(profile.id);

    // Filter appointments for today
    const now = new Date();
    const todayStr = now.toDateString();

    const todayAppointments = appointments.filter((appt) => {
      return new Date(appt.scheduledAt).toDateString() === todayStr;
    });

    // Format today consultations
    const todayConsultations = todayAppointments.map((appt) => {
      const apptTime = new Date(appt.scheduledAt);
      const diffMs = Math.abs(now.getTime() - apptTime.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);
      
      const status: "Berlangsung" | "Terjadwal" = 
        appt.status === "COMPLETED" ? "Berlangsung" :
        (diffHours <= 1 && appt.status === "SCHEDULED") ? "Berlangsung" : "Terjadwal";

      return {
        id: appt.id,
        clientName: appt.user.name || appt.user.email || "Klien",
        clientRole: appt.user.usia ? `Pasien · ${appt.user.usia} Tahun` : "Pasien",
        clientImage: appt.user.image || "https://i.pravatar.cc/150",
        schedule: `Video Call · ${apptTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
        status,
      };
    });

    // Format consultation history
    const consultationHistory = appointments.map((appt) => {
      const apptDate = new Date(appt.scheduledAt);
      
      const status: "Selesai" | "Dijadwalkan" | "Dibatalkan" = 
        appt.status === "COMPLETED" ? "Selesai" :
        appt.status === "CANCELLED" ? "Dibatalkan" : "Dijadwalkan";

      const psychName = profile.user.name || "Psikolog";
      const initials = psychName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      return {
        id: appt.id,
        psychologName: psychName,
        psychologInitials: initials,
        date: apptDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        status,
      };
    });

    // Format client list (extract unique clients from appointments)
    const uniqueClientsMap = new Map<string, typeof appointments[0]["user"]>();
    for (const appt of appointments) {
      if (!uniqueClientsMap.has(appt.userId)) {
        uniqueClientsMap.set(appt.userId, appt.user);
      }
    }

    const clientList = await Promise.all(
      Array.from(uniqueClientsMap.values()).map(async (user) => {
        // Fetch latest screening for client
        const latestScreening = await screeningRepository.getLatestScreeningResult(user.id);
        
        let priority: "Prioritas Tinggi" | "Prioritas Sedang" | "Prioritas Rendah" = "Prioritas Rendah";
        let mood = "Baik";
        let trend = "Stabil";
        let screeningResultsArr: ScreeningResult[] = [
          { label: "Kecemasan (GAD-7)", value: "Normal", level: "Rendah" },
          { label: "Stres (PSS)", value: "Normal", level: "Rendah" },
        ];

        if (latestScreening) {
          const score = latestScreening.score;
          if (score >= 14) {
            priority = "Prioritas Tinggi";
            mood = "Buruk";
          } else if (score >= 8) {
            priority = "Prioritas Sedang";
            mood = "Rendah";
          } else {
            priority = "Prioritas Rendah";
            mood = "Baik";
          }

          // Fetch all user screenings to determine trend
          const allScreenings = await screeningRepository.getScreeningsByUserId(user.id, 2);

          if (allScreenings.length >= 2) {
            const currentScore = allScreenings[0].score;
            const prevScore = allScreenings[1].score;
            if (currentScore > prevScore) {
              trend = "Menurun"; // higher distress is worse/menurun
            } else if (currentScore < prevScore) {
              trend = "Membaik";
            }
          }

          // Map composite score into screening results list
          const depCat = screeningService.getDepressionCategory(score);
          let level: "Rendah" | "Sedang" | "Tinggi" = "Rendah";
          if (score >= 14) level = "Tinggi";
          else if (score >= 8) level = "Sedang";

          screeningResultsArr = [
            { label: "Tingkat Stres (Skrining)", value: depCat, level },
            { label: "Skor Kumulatif", value: `${score} / 21`, level },
          ];
        }

        // Get AI session conclusion
        const conclusion = await this.getLatestAiSessionConclusion(user.id);
        const aiSummary = conclusion 
          ? [conclusion] 
          : ["Belum ada kesimpulan sesi curhat AI yang diselesaikan oleh pasien ini."];

        return {
          id: user.id,
          name: user.name || user.email || "Klien",
          role: user.usia ? `Pasien · ${user.usia} Tahun` : "Pasien",
          image: user.image || "https://i.pravatar.cc/150",
          priority,
          mood,
          trend,
          screeningResults: screeningResultsArr,
          aiSummary,
        };
      })
    );

    return {
      psychologist: {
        name: profile.user.name || "Spesialis",
        image: profile.imageUrl,
      },
      todayConsultations,
      consultationHistory,
      clientList,
    };
  }
}

const psychologistService = new PsychologistService()
export default psychologistService
