import { aiClient } from "@/ai/client";
import { loadPrompt } from "@/ai/loader";

export class AIService {
    async sendChatMessage(chatHistory: string, prompt: string) {
        try {
            const raw = loadPrompt("chat.prompt");
            const finalPrompt = raw.replace("{{user_history}}", chatHistory).replace("{{user_message}}", prompt);

            const response = await aiClient.generateContent(finalPrompt);
            if (!response) {
                throw new Error("No response from AI");
            }

            return response;
        }
        catch (error) {
            console.error("AI service error:", error);
            throw error;
        }
    }

    async sendChatMessageStream(chatHistory: string, prompt: string, onChunk: (text: string) => void) {
        try {
            const raw = loadPrompt("chat.prompt");
            const finalPrompt = raw.replace("{{user_history}}", chatHistory).replace("{{user_message}}", prompt);

            const response = await aiClient.generateContentStream(finalPrompt, onChunk);
            if (!response) {
                throw new Error("No response from AI");
            }

            return response;
        }
        catch (error) {
            console.error("AI service streaming error:", error);
            throw error;
        }
    }
}

const aiService = new AIService();
export default aiService;