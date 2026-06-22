import { db } from "@/lib/db";
import { AppointmentStatus } from "../../generated/prisma/enums";


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
                status: {
                    in: [AppointmentStatus.APPROVED, AppointmentStatus.SCHEDULED],
                },
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
                    in: [AppointmentStatus.PENDING, AppointmentStatus.APPROVED, AppointmentStatus.SCHEDULED, AppointmentStatus.COMPLETED],
                },
            },
        });
    }

    async findActiveScheduledAppointment(userId: string) {
        return await db.appointment.findFirst({
            where: {
                userId,
                status: {
                    in: [AppointmentStatus.PENDING, AppointmentStatus.APPROVED, AppointmentStatus.SCHEDULED],
                },
            },
        });
    }

    async updateAppointmentStatus(id: string, status: AppointmentStatus) {
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
                status: AppointmentStatus.PENDING,     
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

    async getLatestChatSession(userId: string) {
        return await db.chatSession.findFirst({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
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

    async getAppointmentByIdAndPsychologistId(id: string, psychologistId: string) {
        return await db.appointment.findFirst({
            where: {
                id,
                psychologistId,
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
    }

    async getNearestScheduledAppointment(psychologistId: string) {
        const { AppointmentStatus } = await import("../../generated/prisma/enums");
        return await db.appointment.findFirst({
            where: {
                psychologistId,
                status: {
                    in: [AppointmentStatus.APPROVED, AppointmentStatus.SCHEDULED]
                },
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

    async getUserUpcomingAppointments(userId: string) {
        return await db.appointment.findMany({
            where: {
                userId,
                status: {
                    in: [AppointmentStatus.APPROVED, AppointmentStatus.SCHEDULED, AppointmentStatus.PENDING],
                },
                scheduledAt: {
                    gte: new Date(),
                },
            },
            include: {
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
}

const psychologistRepository = new PsychologistRepository();
export default psychologistRepository;
