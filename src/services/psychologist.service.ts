import userRepository from "@/repositories/user.repository"
import psychologistRepository from "@/repositories/psychologist.repository"
import screeningRepository from "@/repositories/screening.repository"

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

  async getPsychologistAppointments(profileId: string) {
    return await psychologistRepository.getPsychologistAppointments(profileId)
  }
}

const psychologistService = new PsychologistService()
export default psychologistService
