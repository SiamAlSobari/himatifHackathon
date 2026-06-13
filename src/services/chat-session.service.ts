import chatSessionRepository from "@/repositories/chatSessionRepository";

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
}

const chatSessionService = new ChatSessionService();
export default chatSessionService;