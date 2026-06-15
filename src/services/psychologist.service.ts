import { db } from "@/lib/db"

export class PsychologistService {
  async getUserProfile(id: string) {
    return await db.user.findUnique({
      where: { id },
      select: { name: true, image: true, email: true, usia: true, jenisKelamin: true, isOnboarded: true },
    })
  }

  async getPsychologists() {
    return await db.psychologist.findMany({
      orderBy: { rating: "desc" },
    })
  }


  async getActiveAppointment(userId: string) {
    return await db.appointment.findFirst({
      where: {
        userId,
        status: "SCHEDULED",
      },
      include: {
        psychologist: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    })
  }

  async getLatestScreening(userId: string) {
    return await db.screening.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })
  }

  async bookAppointment(userId: string, psychologistId: string, scheduledAt: Date) {
    // Check if psychologist exists
    const psych = await db.psychologist.findUnique({
      where: { id: psychologistId },
    })

    if (!psych) {
      throw new Error("Psikolog tidak ditemukan")
    }

    // Check if user already has an active scheduled appointment
    const existing = await db.appointment.findFirst({
      where: {
        userId,
        status: "SCHEDULED",
      },
    })

    if (existing) {
      // Cancel the previous one
      await db.appointment.update({
        where: { id: existing.id },
        data: { status: "CANCELLED" },
      })
    }

    // Create new appointment
    return await db.appointment.create({
      data: {
        userId,
        psychologistId,
        scheduledAt,
        status: "SCHEDULED",
      },
      include: {
        psychologist: true,
      },
    })
  }

  async cancelAppointment(appointmentId: string, userId: string) {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!appointment || appointment.userId !== userId) {
      throw new Error("Appointment not found or unauthorized")
    }

    return await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CANCELLED",
      },
    })
  }
}

const psychologistService = new PsychologistService()
export default psychologistService
