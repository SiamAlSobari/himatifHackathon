import { db } from "@/lib/db";
import { ScreeningType } from "../../generated/prisma/enums";

class ScreeningRepository {
    async createScreeningResult(userId: string, type: ScreeningType, score: number, answers: string) {
        return await db.screening.create({
            data: {
                userId,
                type,
                score,
                answer: answers
            },
        })
    }
    
    async getLatestScreeningResult(userId: string) {
        return await db.screening.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
    }

    async getScreeningsByUserId(userId: string, limit?: number) {
        return await db.screening.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
}

const screeningRepository = new ScreeningRepository();
export default screeningRepository;