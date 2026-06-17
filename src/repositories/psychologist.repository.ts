import { db } from "@/lib/db";

class PsychologistRepository {
    async getPsychologistProfileByUserId(userId: string) {
        return await db.psychologistProfile.findUnique({
            where: { userId },
            include: { user: true },
        });
    }

    async getPsychologists() {
        return await db.psychologistProfile.findMany({
            orderBy: { rating: "desc" },
            include: { user: true },
        });
    }

    async getPsychologistProfileById(id: string) {
        return await db.psychologistProfile.findUnique({
            where: { id },
        });
    }

    async updatePsychologistRating(id: string, rating: number) {
        return await db.psychologistProfile.update({
            where: { id },
            data: { rating },
        });
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
        });
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
        });
    }

    async getAppointmentWithProfile(id: string) {
        return await db.appointment.findUnique({
            where: { id },
            include: {
                psychologistProfile: true,
            },
        });
    }

    async findAppointmentToday(userId: string, psychologistId: string, startOfDay: Date, endOfDay: Date) {
        return await db.appointment.findFirst({
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
    }

    async findActiveScheduledAppointment(userId: string) {
        return await db.appointment.findFirst({
            where: {
                userId,
                status: "SCHEDULED",
            },
        });
    }

    async updateAppointmentStatus(id: string, status: "SCHEDULED" | "COMPLETED" | "CANCELLED") {
        return await db.appointment.update({
            where: { id },
            data: { status },
        });
    }

    async createAppointment(userId: string, psychologistId: string, scheduledAt: Date) {
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
        });
    }

    async getConsultationMessages(appointmentId: string) {
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

    async getLatestCompletedChatSession(userId: string) {
        return await db.chatSession.findFirst({
            where: {
                userId,
                status: "COMPLETED",
            },
            include: {
                chatMessages: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }

    async createPsychologistProfile(data: {
        userId: string;
        role: string;
        specialty: string;
        rating: number;
        experienceYears: number;
        imageUrl: string;
        availability: string;
        tags: string[];
    }) {
        return await db.psychologistProfile.create({
            data,
        });
    }

    async getPsychologistAppointments(profileId: string) {
        return await db.appointment.findMany({
            where: { psychologistId: profileId },
            include: {
                user: true,
            },
            orderBy: {
                scheduledAt: "desc",
            },
        });
    }
}

const psychologistRepository = new PsychologistRepository();
export default psychologistRepository;
