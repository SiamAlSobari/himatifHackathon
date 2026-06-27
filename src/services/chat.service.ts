import { loadPrompt } from "@/ai/loader";
import { AIResponseFormatter } from "@/lib/utils";
import chatMessageRepository from "@/repositories/chatMessage.repository";
import aiService from "./ai.service";
import { AIChatResponse } from "@/lib/types/ai";
import screeningService from "./screening.service";
import screeningRepository from "@/repositories/screening.repository";
import chatSessionRepository from "@/repositories/chatSessionRepository";
import { pusherServer } from "@/lib/pusher/pusher-server";
import sessionSummaryService from "./sessionSummary.service";
import blockchainSyncService from "./blockchain-sync.service";

const AI_RESPONSE_TIMEOUT_MS = 60_000; // 60 detik timeout

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
            // Cek apakah ada session dengan sessionId tersebut
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

                // Bug fix #3: Simpan pesan pertama user ke DB jika ada isinya
                if (message && message.trim().length > 0) {
                    await chatMessageRepository.createMessage(sessionId, "USER", message, null);
                }
            } else {
                // Kalau bukan pesan pertama, simpan dulu pesannya ke database sebelum dikirim ke AI
                await chatMessageRepository.createMessage(sessionId, "USER", message, null);
            }

            // Bug fix #1 & #5: Proses AI dengan error handling yang proper (bukan fire-and-forget)
            this.processAIResponse(userId, sessionId, formattedHistory, userPrompt).catch(error => {
                console.error("[ChatService] Error getting AI response:", error);
                // Kirim error notification ke frontend via Pusher
                pusherServer.trigger(`user-${userId}`, "chat-finished", {
                    status: "error",
                    name: "calm_blue",
                    error: "Terjadi kesalahan saat memproses respons AI. Silakan coba lagi.",
                }).catch(pushErr => {
                    console.error("[ChatService] Gagal mengirim error notification via Pusher:", pushErr);
                });
            });

            // Bug fix #4: Selalu return data yang valid
            return { status: "processing", sessionId };
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    private async processAIResponse(userId: string, sessionId: string, formattedHistory: string, prompt: string,) {
        let response: string | undefined = "";

        try {
            // Bug fix #7: Wrap AI call dengan timeout
            response = await Promise.race([
                aiService.sendChatMessageStream(formattedHistory, prompt, (chunk) => {
                    // Send to client in real-time via Pusher
                    pusherServer.trigger(`user-${userId}`, "chat-chunk", {
                        sessionId,
                        chunk,
                    }).catch(pushErr => {
                        console.error("[ChatService] Gagal mengirim chunk via Pusher:", pushErr);
                    });
                }),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error("AI response timeout after 60s")), AI_RESPONSE_TIMEOUT_MS)
                ),
            ]);
        } catch (aiError) {
            console.error("[ChatService] AI call failed:", aiError);
            // Simpan error message ke DB supaya user tahu ada masalah
            const errorMsg = "Maaf, Very AI sedang mengalami gangguan. Silakan coba kirim pesan lagi nanti.";
            await chatMessageRepository.createMessage(sessionId, "ASSISTANT", errorMsg, {
                uiTheme: "calm_blue",
                isCrisis: false,
                needPsychologist: false,
                isSessionEnded: false,
                analysis: {
                    anxietyLevel: "Rendah",
                    insomniaLevel: "Rendah",
                    depressionLevel: "Rendah",
                    aiValidationAdvice: "",
                },
            });
            // Tetap kirim Pusher event supaya frontend tahu proses selesai
            await pusherServer.trigger(`user-${userId}`, "chat-finished", {
                status: "error",
                name: "calm_blue",
            });
            return;
        }

        let formattedResponse: AIChatResponse;
        try {
            formattedResponse = AIResponseFormatter<AIChatResponse>(response);
        } catch (parseError) {
            console.error("[ChatService] Failed to parse AI response:", parseError);
            const errorMsg = "Maaf, Very AI mengirim respons yang tidak valid. Silakan coba lagi.";
            await chatMessageRepository.createMessage(sessionId, "ASSISTANT", errorMsg, {
                uiTheme: "calm_blue",
                isCrisis: false,
                needPsychologist: false,
                isSessionEnded: false,
                analysis: {
                    anxietyLevel: "Rendah",
                    insomniaLevel: "Rendah",
                    depressionLevel: "Rendah",
                    aiValidationAdvice: "",
                },
            });
            await pusherServer.trigger(`user-${userId}`, "chat-finished", {
                status: "error",
                name: "calm_blue",
            });
            return;
        }

        // Simpan response dari AI ke database
        const metaDataWithConclusion = {
            ...(formattedResponse.metaData || {}),
            finalConclusion: formattedResponse.finalConclusion || null,
        };
        const fallbackBalasan = (formattedResponse as unknown as Record<string, string>).balasan_ai;
        const assistantResponseContent = formattedResponse.suggestion || fallbackBalasan || response || "Maaf, Very AI sedang beristirahat sejenak. Silakan coba kirim pesan lagi.";
        const createdAssistantMessage = await chatMessageRepository.createMessage(sessionId, "ASSISTANT", assistantResponseContent, metaDataWithConclusion);
        if (!createdAssistantMessage) {
            throw new Error("Failed to save AI response to the database.");
        }

        // Save session summary if finalConclusion is returned
        const fallbackConclusion = (formattedResponse.metaData as unknown as Record<string, string>)?.finalConclusion;
        const finalConclusion = formattedResponse.finalConclusion || fallbackConclusion;
        if (finalConclusion) {
            await sessionSummaryService.createOrUpdateSummary(sessionId, finalConclusion);
        }

        // Bug fix #6: Hitung user messages SEBELUM menyimpan response AI (lebih akurat)
        const messages = await chatMessageRepository.getSessionChats(sessionId);
        const userMessagesCount = messages.filter(m => m.role === 'USER').length;

        if (userMessagesCount >= 7 || formattedResponse.metaData?.isSessionEnded) {
            await chatSessionRepository.updateStatus(sessionId, "COMPLETED");
            // Trigger blockchain sync asynchronously in the background
            blockchainSyncService.syncChatSession(sessionId).catch(err => {
                console.error("Failed to sync completed chat session to blockchain:", err);
            });
        }

        await pusherServer.trigger(
            `user-${userId}`,
            "chat-finished",
            {
                status: "completed",
                name: formattedResponse.metaData?.uiTheme || "calm_blue",
            }
        )
        console.log("AI response processed and saved successfully.");

        return formattedResponse
    }
}

const chatService = new ChatService();
export default chatService;