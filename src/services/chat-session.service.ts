import chatSessionRepository from "@/repositories/chatSessionRepository";
import { db } from "@/lib/db";
import chatService from "./chat.service";

export class ChatSessionService {
    async getUserChatSessions(userId: string) {
        try {
            return await chatSessionRepository.getByUserId(userId);
        } catch (error) {
            console.error("Error fetching user chat sessions:", error);
            throw error;
        }
    }

    async getActiveChatSession(userId: string) {
        try {
            return await chatSessionRepository.getActiveSessionByUserId(userId);
        } catch (error) {
            console.error("Error fetching active chat session:", error);
            throw error;
        }
    }

    async createChatSession(userId: string) {
        try {
            const activeSession = await chatSessionRepository.getActiveSessionByUserId(userId);
            if (activeSession) {
                throw new Error("An active chat session already exists for this user.");
            }
            return await chatSessionRepository.createSession(userId);
        } catch (error) {
            console.error("Error creating chat session:", error);
            throw error;
        }
    }

    async resetChatSession(userId: string, sessionId: string) {
        try {
            const session = await chatSessionRepository.getById(sessionId);
            if (!session) {
                throw new Error("Sesi tidak ditemukan");
            }

            if (session.userId !== userId) {
                throw new Error("Unauthorized");
            }

            if (session.status !== "ACTIVE") {
                throw new Error("Sesi ini sudah tidak aktif");
            }

            if (session.hasBeenReset) {
                throw new Error("Sesi ini sudah pernah direset sebelumnya");
            }

            if (session.txHash || session.ipfsCid) {
                throw new Error("Sesi ini sudah terintegrasi dengan blockchain");
            }

            // Hapus semua pesan chat dan ringkasan sesi, lalu set hasBeenReset menjadi true
            await db.$transaction([
                db.chatMessage.deleteMany({
                    where: { sessionId }
                }),
                db.sessionSummary.deleteMany({
                    where: { chatSessionId: sessionId }
                }),
                db.chatSession.update({
                    where: { id: sessionId },
                    data: { hasBeenReset: true }
                })
            ]);

            // Pemicu sapaan awal AI (First chat dari AI)
            await chatService.sendMessage(userId, sessionId, "");

            return { success: true };
        } catch (error) {
            console.error("Error resetting chat session:", error);
            throw error;
        }
    }
}

const chatSessionService = new ChatSessionService();
export default chatSessionService;