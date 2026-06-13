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

    async createSession(userId: string) {
        return await db.chatSession.create({
            data: {
                userId,
                status: "ACTIVE",
            }
        })
    }

    async getById(sessionId: string) {
        return await db.chatSession.findUnique({
            where: { id: sessionId },
        })
    }

    async getActiveSessionByUserId(userId: string) {
        return await db.chatSession.findFirst({
            where: { userId, status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    }
                },
                chatMessages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        })
    }
}

export const chatSessionRepository = new ChatSessionRepository();
export default chatSessionRepository;