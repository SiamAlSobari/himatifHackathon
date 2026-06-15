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
    let messages = await db.consultationMessage.findMany({
      where: { appointmentId },
      orderBy: { createdAt: "asc" },
    });

    if (messages.length === 0) {
      const now = new Date();
      const initialData = [
        {
          sender: "psychologist",
          text: "Halo. Saya Dr. Sarah. Saya sudah meninjau hasil skrining 'Kenali' Anda. Terima kasih sudah bersedia berbagi. Bagaimana perasaan Anda saat ini?",
          offsetMinutes: 8,
        },
        {
          sender: "user",
          text: "Halo Dokter. Sejujurnya saya merasa sangat cemas beberapa hari terakhir ini. Sulit sekali untuk fokus di pekerjaan.",
          offsetMinutes: 5,
        },
        {
          sender: "psychologist",
          text: "Saya mengerti, rasa cemas memang bisa sangat menguras energi. Di laporan Anda tertulis ada gangguan tidur juga, apakah itu masih berlanjut sampai tadi malam?",
          offsetMinutes: 4,
        },
        {
          sender: "user",
          text: "Iya Dokter, saya hanya tidur sekitar 3-4 jam. Pikiran saya tidak bisa berhenti berputar tentang kesalahan-kesalahan kecil di kantor.",
          offsetMinutes: 2,
        },
        {
          sender: "psychologist",
          text: "Pikiran yang berulang (rumination) memang seringkali mengganggu waktu istirahat. Mari kita coba teknik pernapasan sejenak sebelum kita bahas lebih lanjut, apakah Anda bersedia?",
          offsetMinutes: 1,
        },
      ];

      const seededMessages = [];
      for (const item of initialData) {
        const msgTime = new Date(now.getTime() - item.offsetMinutes * 60 * 1000);
        const msg = await db.consultationMessage.create({
          data: {
            appointmentId,
            sender: item.sender,
            text: item.text,
            createdAt: msgTime,
          },
        });
        seededMessages.push(msg);
      }
      messages = seededMessages;
    }

    return messages;
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
}

const psychologistService = new PsychologistService()
export default psychologistService
