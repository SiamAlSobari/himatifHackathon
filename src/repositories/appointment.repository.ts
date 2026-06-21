import { db } from "@/lib/db";
import { AppointmentStatus } from "../../generated/prisma/enums";

class AppointmentRepository {
    async getUserAppointments(userId: string, limit?: number) {
        return await db.appointment.findMany({
            where: { userId },
            include: {
                psychologistProfile: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                scheduledAt: "desc",
            },
            take: limit,
        });
    }

    async getUserCompletedAppointments(userId: string) {
        return await db.appointment.findMany({
            where: {
                userId,
                status: {
                    in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]
                }
            },
            include: {
                psychologistProfile: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                scheduledAt: "desc",
            },
        });
    }

    async getPsychologistCompletedAppointments(psychologistId: string) {
        return await db.appointment.findMany({
            where: {
                psychologistId,
                status: {
                    in: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED]
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        usia: true,
                        jenisKelamin: true,
                    }
                }
            },
            orderBy: {
                scheduledAt: "desc",
            },
        });
    }

    async getAppointmentWithParticipants(appointmentId: string) {
        return await db.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                psychologistProfile: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async getAppointmentCount(userId: string) {
        return await db.appointment.count({
            where: { userId },
        });
    }

    async updateBlockchainData(appointmentId: string, ipfsCid: string, txHash: string) {
        return await db.appointment.update({
            where: { id: appointmentId },
            data: { ipfsCid, txHash }
        });
    }

    async updateStatus(appointmentId: string, status: AppointmentStatus) {
        return await db.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });
    }
}

const appointmentRepository = new AppointmentRepository();
export default appointmentRepository;

