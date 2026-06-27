import { envConfig } from "@/lib/constants/env";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";
import { loadPrompt } from "./loader";

interface ProviderConfig {
    name: string;
    provider: 'gemini' | 'groq';
    model: string;
    apiKey: string;
}

export class AIClient {
    private maxOutputTokens = 2048;
    private temperature = 0.7;
    private systemInstruction = loadPrompt("rootPrompt.prompt") || "You are a helpful assistant that provides accurate and concise information based on the user's query. Always provide relevant and informative responses, and avoid unnecessary details. If you don't know the answer, say you don't know instead of making up information.";

    private geminiClients: Record<string, GoogleGenAI> = {};
    private groqClients: Record<string, OpenAI> = {};

    private getGeminiClient(apiKey: string): GoogleGenAI {
        if (!this.geminiClients[apiKey]) {
            this.geminiClients[apiKey] = new GoogleGenAI({
                apiKey: apiKey,
            });
        }
        return this.geminiClients[apiKey];
    }

    private getGroqClient(apiKey: string): OpenAI {
        if (!this.groqClients[apiKey]) {
            this.groqClients[apiKey] = new OpenAI({
                apiKey: apiKey,
                baseURL: "https://api.groq.com/openai/v1",
            });
        }
        return this.groqClients[apiKey];
    }

    private getActiveProviders(): ProviderConfig[] {
        const configs: ProviderConfig[] = [];
        if (envConfig.GeminiApiKey) {
            configs.push({
                name: "Gemini Utama",
                provider: "gemini",
                model: "gemini-3.1-flash-lite",
                apiKey: envConfig.GeminiApiKey,
            });
        }
        if (envConfig.GroqApiKey) {
            configs.push({
                name: "Groq Fallback",
                provider: "groq",
                model: "llama-3.3-70b-versatile",
                apiKey: envConfig.GroqApiKey,
            });
        }
        if (envConfig.GeminiApiKey2) {
            configs.push({
                name: "Gemini Sekunder",
                provider: "gemini",
                model: "gemini-2.5-flash",
                apiKey: envConfig.GeminiApiKey2,
            });
        }
        return configs;
    }

    async generateContent(prompt: string): Promise<string | undefined> {
        const providers = this.getActiveProviders();
        if (providers.length === 0) {
            throw new Error("AIClient Error: GeminiApiKey tidak ditemukan di envConfig!");
        }

        const errors: { provider: string; error: any }[] = [];

        for (const config of providers) {
            try {
                if (config.provider === 'gemini') {
                    const client = this.getGeminiClient(config.apiKey);
                    const response = await client.models.generateContent({
                        model: config.model,
                        contents: prompt,
                        config: {
                            temperature: this.temperature,
                            maxOutputTokens: this.maxOutputTokens,
                            systemInstruction: this.systemInstruction,
                        }
                    });
                    return response?.text || undefined;
                } else if (config.provider === 'groq') {
                    const client = this.getGroqClient(config.apiKey);
                    const response = await client.chat.completions.create({
                        model: config.model,
                        messages: [
                            { role: "system", content: this.systemInstruction },
                            { role: "user", content: prompt },
                        ],
                        temperature: this.temperature,
                        max_tokens: this.maxOutputTokens,
                    });
                    return response.choices[0]?.message?.content || undefined;
                }
            } catch (error: any) {
                console.warn(`[AIClient] Provider ${config.name} (${config.model}) gagal: ${error?.message || error}. Mencoba provider berikutnya...`);
                errors.push({ provider: config.name, error });
            }
        }

        const errorDetails = errors.map(e => `${e.provider}: ${e.error?.message || e.error}`).join("; ");
        throw new Error(`AIClient Total Failure. All providers failed. Details: [${errorDetails}]`);
    }

    async generateContentStream(prompt: string, onChunk: (text: string) => void): Promise<string> {
        const providers = this.getActiveProviders();
        if (providers.length === 0) {
            throw new Error("AIClient Error: GeminiApiKey tidak ditemukan di envConfig!");
        }

        const errors: { provider: string; error: any }[] = [];

        for (const config of providers) {
            try {
                let fullText = "";
                if (config.provider === 'gemini') {
                    const client = this.getGeminiClient(config.apiKey);
                    const responseStream = await client.models.generateContentStream({
                        model: config.model,
                        contents: prompt,
                        config: {
                            temperature: this.temperature,
                            maxOutputTokens: this.maxOutputTokens,
                            systemInstruction: this.systemInstruction,
                        }
                    });
                    for await (const chunk of responseStream) {
                        const chunkText = chunk.text || "";
                        if (chunkText) {
                            fullText += chunkText;
                            onChunk(chunkText);
                        }
                    }
                    return fullText;
                } else if (config.provider === 'groq') {
                    const client = this.getGroqClient(config.apiKey);
                    const responseStream = await client.chat.completions.create({
                        model: config.model,
                        messages: [
                            { role: "system", content: this.systemInstruction },
                            { role: "user", content: prompt },
                        ],
                        temperature: this.temperature,
                        max_tokens: this.maxOutputTokens,
                        stream: true,
                    });
                    for await (const chunk of responseStream) {
                        const chunkText = chunk.choices[0]?.delta?.content || "";
                        if (chunkText) {
                            fullText += chunkText;
                            onChunk(chunkText);
                        }
                    }
                    return fullText;
                }
            } catch (error: any) {
                console.warn(`[AIClient] Streaming gagal untuk provider ${config.name} (${config.model}): ${error?.message || error}. Mencoba provider berikutnya...`);
                errors.push({ provider: config.name, error });
            }
        }

        const errorDetails = errors.map(e => `${e.provider}: ${e.error?.message || e.error}`).join("; ");
        throw new Error(`AIClient Streaming Total Failure. All providers failed. Details: [${errorDetails}]`);
    }
}

export const aiClient = new AIClient();