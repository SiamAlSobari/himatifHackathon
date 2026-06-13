import { envConfig } from "@/lib/constants/env";
import { GoogleGenAI } from "@google/genai";
import { loadPrompt } from "./loader";

export class AIClient {
    private model = "gemini-3.1-flash-lite";
    private fallbackModel = "gemini-2.5-flash";
    private apiKey = envConfig.GeminiApiKey;
    private maxOutputTokens = 2048;
    private temperature = 0.7;
    private systemInstruction = loadPrompt("rootPrompt.prompt") || "You are a helpful assistant that provides accurate and concise information based on the user's query. Always provide relevant and informative responses, and avoid unnecessary details. If you don't know the answer, say you don't know instead of making up information.";

    private client: GoogleGenAI;

    constructor() {
        if (!this.apiKey) {
            throw new Error("AIClient Error: GeminiApiKey tidak ditemukan di envConfig!");
        }

        this.client = new GoogleGenAI({
            apiKey: this.apiKey,
        });
    }

    async generateContent(prompt: string) {
        try {
            const response = await this.client?.models.generateContent({
                model: this.model,
                contents: prompt,
                config: {
                    temperature: this.temperature,
                    maxOutputTokens: this.maxOutputTokens,
                    systemInstruction: this.systemInstruction,
                }
            })

            return response?.text;
        } catch (primaryError) {
            console.warn(`[AIClient] Model utama (${this.model}) gagal. Mencoba fallback ke ${this.fallbackModel}...`, primaryError);
            return await this.generateContentWithFallback(prompt, primaryError);
        }
    }

    async generateContentWithFallback(prompt: string, originalError: any) {
        try {
            const response = await this.client?.models.generateContent({
                model: this.fallbackModel,
                contents: prompt,
                config: {
                    temperature: this.temperature,
                    maxOutputTokens: this.maxOutputTokens,
                    systemInstruction: this.systemInstruction,
                }
            })

            return response?.text;
        } catch (fallbackError: any) {
            console.error("[AIClient] Kedua model gagal mengeksekusi request!");
            // Lemparkan error gabungan agar tahu persis apa yang rusak di backend
            throw new Error(
                `AIClient Total Failure. Primary Error: ${originalError?.message || originalError}. Fallback Error: ${fallbackError?.message || fallbackError}`
            );
        }
    }
}

export const aiClient = new AIClient();