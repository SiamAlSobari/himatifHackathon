import { db } from "@/lib/db";

export class SessionSummaryRepository {
    async upsert(chatSessionId: string, summary: string) {
        return await db.sessionSummary.upsert({
            where: { chatSessionId },
            update: { summary },
            create: {
                chatSessionId,
                summary,
            },
        });
    }

    async getByChatSessionId(chatSessionId: string) {
        return await db.sessionSummary.findUnique({
            where: { chatSessionId },
        });
    }

    async getLatestByUserId(userId: string) {
        return await db.sessionSummary.findFirst({
            where: {
                chatSession: {
                    userId,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}

export const sessionSummaryRepository = new SessionSummaryRepository();
export default sessionSummaryRepository;
