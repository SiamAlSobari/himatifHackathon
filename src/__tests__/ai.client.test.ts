// Mock dependencies
jest.mock("@/lib/constants/env", () => ({
  envConfig: {
    GeminiApiKey: "test-api-key-1",
    GroqApiKey: "test-groq-key",
    GeminiApiKey2: "test-api-key-2",
  },
}));

jest.mock("@/ai/loader", () => ({
  loadPrompt: jest.fn().mockReturnValue("System instruction test"),
}));

jest.mock("@google/genai", () => {
  const mockGenerateContent = jest.fn();
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
    __mockGenerateContent: mockGenerateContent,
  };
});

jest.mock("openai", () => {
  const mockCreate = jest.fn();
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    })),
    __mockCreate: mockCreate,
  };
});

// Import after mocks
import { AIClient } from "@/ai/client";

describe("AIClient", () => {
  let client: AIClient;
  let mockGenerateContent: jest.Mock;
  let mockChatCompletionsCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset client instances
    (AIClient as unknown as Record<string, unknown>).instance = undefined;

    const genai = require("@google/genai");
    mockGenerateContent = genai.__mockGenerateContent;

    const openai = require("openai");
    mockChatCompletionsCreate = openai.__mockCreate;

    mockChatCompletionsCreate.mockReset();
    mockGenerateContent.mockReset();

    client = new AIClient();
  });

  describe("generateContent", () => {
    it("should call primary model (Gemini Utama) first", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Hello from Gemini 1" });

      const result = await client.generateContent("Test prompt");

      expect(result).toBe("Hello from Gemini 1");
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockChatCompletionsCreate).not.toHaveBeenCalled();

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBe("gemini-3.1-flash-lite");
      expect(callArgs.contents).toBe("Test prompt");
    });

    it("should fallback to Groq when primary Gemini fails", async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error("Gemini 1 failed"));
      mockChatCompletionsCreate.mockResolvedValue({
        choices: [{ message: { content: "Hello from Groq" } }],
      });

      const result = await client.generateContent("Test prompt");

      expect(result).toBe("Hello from Groq");
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);

      const callArgs = mockChatCompletionsCreate.mock.calls[0][0];
      expect(callArgs.model).toBe("llama-3.3-70b-versatile");
      expect(callArgs.messages).toEqual([
        { role: "system", content: "System instruction test" },
        { role: "user", content: "Test prompt" },
      ]);
    });

    it("should fallback to Gemini Sekunder when primary Gemini and Groq fail", async () => {
      mockGenerateContent
        .mockRejectedValueOnce(new Error("Gemini 1 failed")) // Gemini Utama
        .mockResolvedValueOnce({ text: "Hello from Gemini 2" }); // Gemini Sekunder

      mockChatCompletionsCreate.mockRejectedValueOnce(new Error("Groq failed"));

      const result = await client.generateContent("Test prompt");

      expect(result).toBe("Hello from Gemini 2");
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);

      // Verify the second Gemini call was for Gemini Sekunder
      const callArgs = mockGenerateContent.mock.calls[1][0];
      expect(callArgs.model).toBe("gemini-2.5-flash");
    });

    it("should throw error when all three providers fail", async () => {
      mockGenerateContent
        .mockRejectedValueOnce(new Error("Gemini 1 failed"))
        .mockRejectedValueOnce(new Error("Gemini 2 failed"));

      mockChatCompletionsCreate.mockRejectedValueOnce(new Error("Groq failed"));

      await expect(client.generateContent("Test")).rejects.toThrow(
        "AIClient Total Failure"
      );
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
      expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);
    });

    it("should throw error when all API keys are missing", async () => {
      const envModule = require("@/lib/constants/env");
      const originalGeminiKey = envModule.envConfig.GeminiApiKey;
      const originalGroqKey = envModule.envConfig.GroqApiKey;
      const originalGeminiKey2 = envModule.envConfig.GeminiApiKey2;

      envModule.envConfig.GeminiApiKey = "";
      envModule.envConfig.GroqApiKey = "";
      envModule.envConfig.GeminiApiKey2 = "";

      const newClient = new AIClient();

      await expect(newClient.generateContent("Test")).rejects.toThrow(
        "GeminiApiKey tidak ditemukan"
      );

      // Restore
      envModule.envConfig.GeminiApiKey = originalGeminiKey;
      envModule.envConfig.GroqApiKey = originalGroqKey;
      envModule.envConfig.GeminiApiKey2 = originalGeminiKey2;
    });

    it("should pass config with temperature and maxOutputTokens", async () => {
      mockGenerateContent.mockResolvedValue({ text: "response" });

      await client.generateContent("Test");

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.config).toBeTruthy();
      expect(callArgs.config.temperature).toBe(0.7);
      expect(callArgs.config.maxOutputTokens).toBe(2048);
      expect(callArgs.config.systemInstruction).toBe("System instruction test");
    });
  });
});
