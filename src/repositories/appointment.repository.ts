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

    async getAppointmentCount(userId: string) {
        return await db.appointment.count({
            where: { userId },
        });
    }
}

const appointmentRepository = new AppointmentRepository();
export default appointmentRepository;
