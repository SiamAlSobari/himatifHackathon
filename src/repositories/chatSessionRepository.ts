import { db } from "@/lib/db";
import { ChatSessionStatus } from "../../generated/prisma/enums";

export class ChatSessionRepository {
    async updateStatus(sessionId: string, status: ChatSessionStatus) {
        return await db.chatSession.update({
            where: { id: sessionId },
            data: { status }
        })
    }
    async getByUserId(userId: string) {
        return await db.chatSession.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                chatMessages: {
                    orderBy: { createdAt: "asc" }
                },
                sessionSummary: true
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
            include: {
                chatMessages: {
                    orderBy: { createdAt: "asc" }
                },
                sessionSummary: true
            }
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

    async getLatestCompletedSession(userId: string) {
        return await db.chatSession.findFirst({
            where: { userId, status: "COMPLETED" },
            orderBy: { updatedAt: "desc" }
        })
    }
}

export const chatSessionRepository = new ChatSessionRepository();
export default chatSessionRepository;