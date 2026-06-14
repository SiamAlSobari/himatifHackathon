import { loadPrompt } from "@/ai/loader";
import { AIResponseFormatter } from "@/lib/utils";
import chatMessageRepository from "@/repositories/chatMessage.repository";
import aiService from "./ai.service";
import { AIChatResponse } from "@/lib/types/ai";
import screeningService from "./screening.service";
import screeningRepository from "@/repositories/screening.repository";
import chatSessionRepository from "@/repositories/chatSessionRepository";
import { pusherServer } from "@/lib/pusher/pusher-server";

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

    async sendMessage(userId: string, sessionId: string, message: string) {
        try {
            let createdUserMessage = null;
            // Cek apakah ada session dengan sessionId tersebut, kalau tidak ada berarti ada yang salah karena seharusnya session sudah dibuat sebelum user bisa mengirim pesan
            const existingSession = await chatSessionRepository.getById(sessionId);
            if (!existingSession) {
                throw new Error("Chat session not found, cannot send message.");
            }

            // Format history
            const formattedHistory = await this.formatChatHistories(sessionId);

            // Jika ini adalah pesan pertama, kita perlu menentukan prompt awal berdasarkan hasil screening terakhir pengguna
            let userPrompt = message;
            const isFirstMessage = formattedHistory.length === 0;
            if (isFirstMessage) {
                // Mendapatkan hasil screening terakhir
                const latestScreening = await screeningRepository.getLatestScreeningResult(userId);
                if (!latestScreening) {
                    throw new Error("No screening result found for user, cannot determine AI response theme.");
                }

                // Menentukan prompt awal berdasarkan hasil screening
                const screeningResult = await screeningService.getScreeningResultByScore(latestScreening?.score || 0);
                userPrompt = loadPrompt("trigger.prompt").replace("{{ui_theme}}", screeningResult);
            } else {
                // Kalau bukan pesan pertama, simpan dulu pesannya ke database sebelum dikirim ke AI
                createdUserMessage = await chatMessageRepository.createMessage(sessionId, "USER", message);
            }

            // Kirim pesan ke AI tanpa menunggu responsnya, biar lebih cepat. Respons dari AI akan diproses di background dan disimpan ke database begitu diterima.
            this.processAIResponse(userId, sessionId, formattedHistory, userPrompt).catch(error => {
                console.error("Error getting AI response:", error);
            });

            return createdUserMessage;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    private async processAIResponse(userId: string, sessionId: string, formattedHistory: string, prompt: string,) {
        const response = await aiService.sendChatMessage(formattedHistory, prompt);
        const formattedResponse = AIResponseFormatter<AIChatResponse>(response);

        // Simpan response dari AI ke database
        const createdAssistantMessage = await chatMessageRepository.createMessage(sessionId, "ASSISTANT", formattedResponse.suggestion);
        if (!createdAssistantMessage) {
            throw new Error("Failed to save AI response to the database.");
        }

        await pusherServer.trigger(
            `user-${userId}`,
            "chat-finished",
            {
                status: "completed",
                name: formattedResponse.metaData.uiTheme,
            }
        )
        console.log("AI response processed and saved successfully.");
        console.log("AI Response:", formattedResponse);
        return formattedResponse
    }
}

const chatService = new ChatService();
export default chatService;