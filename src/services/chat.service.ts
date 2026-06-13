import { loadPrompt } from "@/ai/loader";
import { AIResponseFormatter } from "@/lib/utils";
import chatMessageRepository from "@/repositories/chatMessage.repository";
import aiService from "./ai.service";
import { AIChatResponse } from "@/lib/types/ai";

export class ChatService {
    private async formatChatHistories(sessionId: string) {
        const rawHistories = await chatMessageRepository.getSessionChats(sessionId);
        const pairedHistory = rawHistories.reduce((acc, currentMsg) => {
            if (currentMsg.role === 'ASSISTANT') {
                acc.push({ AI: currentMsg.content, User: "" });
            } else if (currentMsg.role === 'USER') {
                // Kalau User yang ngomong, masukin ke "Turn" terakhir yang dibikin AI
                if (acc.length > 0) {
                    acc[acc.length - 1].User = currentMsg.content;
                } else {
                    acc.push({ AI: "", User: currentMsg.content });
                }
            }

            return acc;
        }, [] as { AI: string; User: string }[]);

        return pairedHistory.map((chat, index) => `--- Turn ${index + 1} ---\nAI: ${chat.AI}\nUser: ${chat.User}`).join('\n\n');
    }

    async sendMessage(sessionId: string, message: string) {
        try {
            const formattedHistory = await this.formatChatHistories(sessionId);
            console.log("Formatted Chat History:\n", formattedHistory);
            let userPrompt = message;
            const isFirstMessage = formattedHistory.length === 0;
            if (isFirstMessage) {
                userPrompt = loadPrompt("trigger.prompt");
            } else {
                await chatMessageRepository.createMessage(sessionId, "USER", message);
            }

            const response = await aiService.sendChatMessage(formattedHistory, userPrompt);
            const formattedResponse = AIResponseFormatter<AIChatResponse>(response);

            const createdAssistantMessage = await chatMessageRepository.createMessage(sessionId, "ASSISTANT", formattedResponse.suggestion);
            if (!createdAssistantMessage) {
                throw new Error("Failed to save AI response to the database.");
            }

            return { created: createdAssistantMessage, response: formattedResponse };
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }
}

const chatService = new ChatService();
export default chatService;