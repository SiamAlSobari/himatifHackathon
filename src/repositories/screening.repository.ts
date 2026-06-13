import { db } from "@/lib/db";

class ScreeningRepository {
    async getLatestScreeningResult(userId: string) {
        return await db.screening.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        })
    }
}

const screeningRepository = new ScreeningRepository();
export default screeningRepository;