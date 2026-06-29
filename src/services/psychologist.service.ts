import userRepository from "@/repositories/user.repository"
import psychologistRepository from "@/repositories/psychologist.repository"
import notificationService from "./notification.service"
import screeningRepository from "@/repositories/screening.repository"
import screeningService from "./screening.service"
import { ScreeningResult } from "@/lib/types/dashboardpsikolog"
import { AppointmentStatus } from "../../generated/prisma/enums"
import sessionSummaryRepository from "@/repositories/sessionSummary.repository"
import { AppThemeEnum } from "@/lib/types/theme"
import { pusherServer } from "@/lib/pusher/pusher-server"
import blockchainSyncService from "./blockchain-sync.service"
import { uploadToCloudinary } from "@/lib/cloudinary"

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
    const appointment = await psychologistRepository.createAppointment(userId, psychologistId, scheduledAt)

    // Send notification to the psychologist
    if (psych.userId) {
      const clientUser = await userRepository.getUserById(userId)
      const clientName = clientUser?.name || clientUser?.email || "Seorang pengguna"
      const scheduledTimeStr = new Date(scheduledAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      })

      await notificationService.createNotification(psych.userId, {
        title: "Booking Janji Temu Baru",
        message: `${clientName} telah memesan sesi konsultasi dengan Anda pada ${scheduledTimeStr}.`,
        type: "BOOKING_DOCTOR",
        metaData: {
          appointmentId: appointment.id,
          clientName: clientName,
          scheduledAt: scheduledAt.toISOString()
        }
      }).catch(err => console.error("Failed to create booking notification:", err))
    }

    return appointment
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

    if (appointment.status === AppointmentStatus.COMPLETED) {
      return appointment;
    }

    const updated = await psychologistRepository.updateAppointmentStatus(appointmentId, AppointmentStatus.COMPLETED)

    // Trigger Pusher notification that session has ended
    await pusherServer.trigger(`appointment-${appointmentId}`, "session-ended", {});

    // Trigger blockchain sync in the background
    blockchainSyncService.syncAppointmentSession(appointmentId).catch(err => {
      console.error("Failed to sync completed appointment session to blockchain:", err);
    });

    return updated;
  }

  async requestEndSession(appointmentId: string, requester: "user" | "psychologist") {
    await pusherServer.trigger(`appointment-${appointmentId}`, "end-session", {
      requester,
    });
  }

  async declineEndSession(appointmentId: string) {
    await pusherServer.trigger(`appointment-${appointmentId}`, "end-session-declined", {});
  }

  async getLatestAiSessionConclusion(userId: string): Promise<string | null> {
    // 1. Try to get summary from SessionSummary table first
    const latestSummary = await sessionSummaryRepository.getLatestByUserId(userId);
    if (latestSummary) {
      return latestSummary.summary;
    }

    // 2. Fallback to parsing finalConclusion from metadata of latest completed session
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
  }) {
    // 1. Cek if email exists
    const existing = await userRepository.getUserByEmail(payload.email);
    if (existing) {
      throw new Error("Email sudah terdaftar");
    }

    // Default placeholder image
    const imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCm0bcB0lzDcZlnjBA25NjhIN4_C42QMvYjxW33jb2jch1A0EQCRcaSsOQUnjy3rMikDcIowjhdMI910iiO8Mkanuvq4kRKzOGEYhvhpRZWqgMKTvJofZGbb1HCI4eoTv1Vn1qqKHhHo7gkufVpq6AlJorSOFs6fEUSvTqlYiY6ylLJ6PTn8i_qY38_KETmZ0HhV_7RTHSyI3bS_qCgyVjEfrcP-GyBylZacT3cErIG9i_P9NGyFCM6FCtBJVVioI0F3eKMqvM8HA";

    // 2. Create user with isOnboarded = false
    const user = await userRepository.createUser({
      email: payload.email,
      passwordHash: payload.passwordHash,
      name: payload.name,
      image: imageUrl,
      role: "PSYCHOLOGY",
      isOnboarded: false,
    });

    // 3. Create psychologist profile with defaults
    await psychologistRepository.createPsychologistProfile({
      userId: user.id,
      role: payload.roleTitle,
      specialty: "",
      rating: 5.0,
      experienceYears: 0,
      imageUrl,
      availability: "AVAILABLE",
      tags: [],
      operationalHours: [],
    });

    return user;
  }

  async onboardPsychologist(
    userId: string,
    payload: {
      specialty: string;
      experienceYears: number;
      tags: string[];
      operationalHours: string[];
    },
    imageFile?: File | null
  ) {
    // 1. Get current profile to get default image
    const profile = await psychologistRepository.getPsychologistProfileByUserId(userId);
    if (!profile) {
      throw new Error("Profil psikolog tidak ditemukan");
    }

    let imageUrl = profile.imageUrl;

    // 2. Upload image to Cloudinary if file provided
    if (imageFile) {
      imageUrl = await uploadToCloudinary(imageFile, "psychologists");
    }

    // 3. Update profile in database
    return await psychologistRepository.updateOnboardingProfile(userId, {
      specialty: payload.specialty,
      experienceYears: payload.experienceYears,
      imageUrl,
      tags: payload.tags,
      operationalHours: payload.operationalHours,
    });
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
      return new Date(appt.scheduledAt).toDateString() === todayStr &&
        (appt.status === "APPROVED" || appt.status === "SCHEDULED" || appt.status === "COMPLETED");
    });

    // Format today consultations
    const todayConsultations = todayAppointments.map((appt) => {
      const apptTime = new Date(appt.scheduledAt);
      const diffMs = Math.abs(now.getTime() - apptTime.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);

      const status: "Berlangsung" | "Terjadwal" | "Selesai" =
        appt.status === "COMPLETED" ? "Selesai" :
          (diffHours <= 1 && (appt.status === "APPROVED" || appt.status === "SCHEDULED")) ? "Berlangsung" : "Terjadwal";

      return {
        id: appt.id,
        clientName: appt.user.name || appt.user.email || "Klien",
        clientRole: appt.user.usia ? `Pasien · ${appt.user.usia} Tahun` : "Pasien",
        clientImage: appt.user.image || "https://i.pravatar.cc/150",
        schedule: `Sesi Chat · ${apptTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`,
        status,
      };
    });

    // Format consultation history
    const consultationHistory = appointments.map((appt) => {
      const apptDate = new Date(appt.scheduledAt);

      const status: "Selesai" | "Dijadwalkan" | "Dibatalkan" | "Kadaluwarsa" =
        appt.status === "COMPLETED" ? "Selesai" :
          appt.status === "CANCELLED" ? "Dibatalkan" :
          appt.status === "EXPIRED" ? "Kadaluwarsa" : "Dijadwalkan";

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
        clientName: appt.user.name || appt.user.email || "Klien",
        psychologInitials: initials,
        date: apptDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        status,
      };
    });

    // Format client list (extract unique clients from appointments)
    const clientList = await this.formatClientList(appointments);

    return {
      psychologist: {
        id: profile.userId,
        name: profile.user.name || "Spesialis",
        image: profile.imageUrl,
      },
      todayConsultations,
      consultationHistory,
      clientList,
    };
  }

  async respondToBooking(appointmentId: string, action: "ACCEPT" | "DECLINE", psychologistUserId: string) {
    const appointment = await psychologistRepository.getAppointmentWithProfile(appointmentId);

    if (!appointment) {
      throw new Error("Jadwal janji temu tidak ditemukan");
    }

    // Verify the psychologist owns this appointment profile
    if (appointment.psychologistProfile.userId !== psychologistUserId) {
      throw new Error("Unauthorized - Anda bukan pemilik jadwal ini");
    }

    const profile = await psychologistRepository.getPsychologistProfileByUserId(psychologistUserId);
    if (!profile) {
      throw new Error("Profil psikolog tidak ditemukan");
    }

    const newStatus = action === "ACCEPT" ? AppointmentStatus.APPROVED : AppointmentStatus.DECLINED;
    const updated = await psychologistRepository.updateAppointmentStatus(appointmentId, newStatus);

    // Format payload for user view
    const activeAppointmentPayload = action === "ACCEPT" ? {
      id: updated.id,
      scheduledAt: updated.scheduledAt.toISOString(),
      psychologist: {
        id: profile.id,
        name: profile.user.name || "Psikolog",
        role: profile.role,
        imageUrl: profile.imageUrl,
      }
    } : null;

    // Trigger Pusher notification for the client (realtime floating button countdown)
    await pusherServer.trigger(`user-${updated.userId}`, "appointment-updated", {
      activeAppointment: activeAppointmentPayload
    });

    // Also trigger self update for psychologist to refresh dashboard
    await pusherServer.trigger(`user-${psychologistUserId}`, "booking-updated", {});

    // Notify client if booking is accepted
    if (action === "ACCEPT") {
      const psychologistName = profile.user.name || "Psikolog";
      const scheduledTimeStr = new Date(updated.scheduledAt).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      });

      await notificationService.createNotification(updated.userId, {
        title: "Jadwal Konsultasi Disetujui",
        message: `Permintaan sesi konsultasi Anda dengan ${psychologistName} telah disetujui untuk ${scheduledTimeStr}.`,
        type: "BOOKING_DOCTOR",
        metaData: {
          appointmentId: updated.id,
          psychologistName,
          scheduledAt: updated.scheduledAt.toISOString()
        }
      }).catch(err => console.error("Failed to create booking approval notification:", err));
    }

    return updated;
  }

  async getClientTheme(userId: string): Promise<string> {
    const latestSession = await psychologistRepository.getLatestChatSession(userId);
    let computedTheme: string | null = null;

    if (latestSession) {
      // Check if session was created today
      const sessionDate = new Date(latestSession.createdAt);
      const today = new Date();
      const isToday = sessionDate.toDateString() === today.toDateString();

      if (isToday) {
        const lastMsg = latestSession.chatMessages.find(m => m.role === "ASSISTANT");
        if (lastMsg && lastMsg.metaData && (lastMsg.metaData as any).uiTheme) {
          computedTheme = (lastMsg.metaData as any).uiTheme;
        }
      }
    }

    if (!computedTheme) {
      const latestScreening = await this.getLatestScreening(userId);
      if (latestScreening) {
        const score = latestScreening.score;

        if (score >= 0 && score <= 4) {
          computedTheme = AppThemeEnum.CALM_BLUE;
        } else if (score >= 5 && score <= 9) {
          computedTheme = AppThemeEnum.WARM_YELLOW;
        } else if (score >= 10 && score <= 13) {
          computedTheme = AppThemeEnum.ALERT_ORANGE;
        } else if (score >= 14 && score <= 21) {
          computedTheme = AppThemeEnum.DEEP_PURPLE;
        }
      }
    }

    return computedTheme || "calm_blue";
  }

  async getPsychologistClients(userId: string) {
    const profile = await psychologistRepository.getPsychologistProfileByUserId(userId);
    if (!profile) {
      throw new Error("Profil psikolog tidak ditemukan");
    }

    const appointments = await psychologistRepository.getPsychologistAppointments(profile.id);
    return await this.formatClientList(appointments);
  }

  private async formatClientList(appointments: any[]) {
    const uniqueClientsMap = new Map<string, typeof appointments[0]["user"]>();
    for (const appt of appointments) {
      if (!uniqueClientsMap.has(appt.userId)) {
        uniqueClientsMap.set(appt.userId, appt.user);
      }
    }

    const clientList = await Promise.all(
      Array.from(uniqueClientsMap.values()).map(async (user) => {
        // Find if this client has a pending appointment with this psychologist
        const pendingAppt = appointments.find((appt) => appt.userId === user.id && appt.status === "PENDING");

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
          pendingAppointmentId: pendingAppt?.id,
        };
      })
    );

    return clientList;
  }

  async getPsychologistConsultationSession(userId: string, appointmentId?: string) {
    const profile = await psychologistRepository.getPsychologistProfileByUserId(userId);
    if (!profile) {
      throw new Error("Profil psikolog tidak ditemukan");
    }

    let activeAppointment = null;
    if (appointmentId) {
      activeAppointment = await psychologistRepository.getAppointmentByIdAndPsychologistId(appointmentId, profile.id);
    } else {
      activeAppointment = await psychologistRepository.getNearestScheduledAppointment(profile.id);
    }

    if (!activeAppointment) {
      return null;
    }

    const clientUser = activeAppointment.user;
    const latestScreening = await this.getLatestScreening(clientUser.id);
    const finalConclusion = await this.getLatestAiSessionConclusion(clientUser.id);
    const clientTheme = await this.getClientTheme(clientUser.id);

    return {
      activeAppointment: {
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
      },
      client: {
        id: clientUser.id,
        name: clientUser.name || clientUser.email || "Klien",
        image: clientUser.image || undefined,
        email: clientUser.email,
        usia: clientUser.usia,
        jenisKelamin: clientUser.jenisKelamin,
      },
      latestScreeningScore: latestScreening?.score || null,
      clientTheme,
      finalConclusion,
      psychologistUser: {
        name: profile.user.name || "Psikolog",
        image: profile.imageUrl,
      },
    };
  }
}

const psychologistService = new PsychologistService()
export default psychologistService
