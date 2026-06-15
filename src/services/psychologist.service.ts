import { db } from "@/lib/db"

export class PsychologistService {
  async getUserProfile(id: string) {
    return await db.user.findUnique({
      where: { id },
      select: { name: true, image: true, email: true, usia: true, jenisKelamin: true, isOnboarded: true },
    })
  }

  async getPsychologists() {
    return await db.psychologistProfile.findMany({
      orderBy: { rating: "desc" },
      include: { user: true },
    })
  }


  async getActiveAppointment(userId: string) {
    return await db.appointment.findFirst({
      where: {
        userId,
        status: "SCHEDULED",
      },
      include: {
        psychologistProfile: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    })
  }

  async getAppointmentById(id: string, userId: string) {
    return await db.appointment.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        psychologistProfile: {
          include: {
            user: true,
          },
        },
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
    const psych = await db.psychologistProfile.findUnique({
      where: { id: psychologistId },
    })

    if (!psych) {
      throw new Error("Psikolog tidak ditemukan")
    }

    // Check if user already booked this specific psychologist today
    const startOfDay = new Date(scheduledAt);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(scheduledAt);
    endOfDay.setHours(23, 59, 59, 999);

    const existingToday = await db.appointment.findFirst({
      where: {
        userId,
        psychologistId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["SCHEDULED", "COMPLETED"],
        },
      },
    });

    if (existingToday) {
      throw new Error("Anda hanya dapat menjadwalkan sesi dengan psikolog ini 1 kali per hari.");
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
        psychologistProfile: {
          include: {
            user: true,
          },
        },
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

  async completeAppointment(appointmentId: string, userId: string) {
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
    })

    if (!appointment || appointment.userId !== userId) {
      throw new Error("Appointment not found or unauthorized")
    }

    return await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "COMPLETED",
      },
    })
  }

  async getLatestAiSessionConclusion(userId: string): Promise<string | null> {
    const latestCompleted = await db.chatSession.findFirst({
      where: {
        userId,
        status: "COMPLETED",
      },
      include: {
        chatMessages: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

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
    return await db.consultationMessage.findMany({
      where: { appointmentId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createConsultationMessage(appointmentId: string, sender: "user" | "psychologist", text: string) {
    return await db.consultationMessage.create({
      data: {
        appointmentId,
        sender,
        text,
      },
    });
  }

  async ratePsychologist(psychologistId: string, userRating: number) {
    const psych = await db.psychologistProfile.findUnique({
      where: { id: psychologistId },
    });
    if (!psych) {
      throw new Error("Psikolog tidak ditemukan");
    }

    // Calculate new rating (assume 9 historical ratings + user rating)
    const newRating = Math.round(((psych.rating * 9 + userRating) / 10) * 10) / 10;

    return await db.psychologistProfile.update({
      where: { id: psychologistId },
      data: { rating: newRating },
    });
  }
}

const psychologistService = new PsychologistService()
export default psychologistService
