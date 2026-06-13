import { db } from "@/lib/db";

export class ChatSessionRepository {
    async getByUserId(userId: string) {
        return await db.chatSession.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                chatMessages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        })
    }

    async createSession(userId: string, name: string) {
        return await db.chatSession.create({
            data: {
                userId,
                status: "ACTIVE",
                name
            }
        })
    }
}

export const chatSessionRepository = new ChatSessionRepository();
export default chatSessionRepository;