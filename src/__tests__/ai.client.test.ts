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
  const mockGenerateContentStream = jest.fn();
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
      },
    })),
    __mockGenerateContent: mockGenerateContent,
    __mockGenerateContentStream: mockGenerateContentStream,
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
  let mockGenerateContentStream: jest.Mock;
  let mockChatCompletionsCreate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset client instances
    (AIClient as unknown as Record<string, unknown>).instance = undefined;

    const genai = require("@google/genai");
    mockGenerateContent = genai.__mockGenerateContent;
    mockGenerateContentStream = genai.__mockGenerateContentStream;

    const openai = require("openai");
    mockChatCompletionsCreate = openai.__mockCreate;

    mockChatCompletionsCreate.mockReset();
    mockGenerateContent.mockReset();
    mockGenerateContentStream.mockReset();

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
      mockGenerateContent.mockPage = jest.fn();
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

  describe("generateContentStream", () => {
    it("should call primary model (Gemini Utama) stream first and stream chunks", async () => {
      mockGenerateContentStream.mockResolvedValue({
        async *[Symbol.asyncIterator]() {
          yield { text: "Hello " };
          yield { text: "from " };
          yield { text: "Gemini 1 stream" };
        }
      });

      const onChunk = jest.fn();
      const result = await client.generateContentStream("Test prompt", onChunk);

      expect(result).toBe("Hello from Gemini 1 stream");
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(1);
      expect(onChunk).toHaveBeenCalledTimes(3);
      expect(onChunk).toHaveBeenNthCalledWith(1, "Hello ");
      expect(onChunk).toHaveBeenNthCalledWith(2, "from ");
      expect(onChunk).toHaveBeenNthCalledWith(3, "Gemini 1 stream");
    });

    it("should fallback to Groq stream when primary Gemini stream fails", async () => {
      mockGenerateContentStream.mockRejectedValueOnce(new Error("Gemini 1 stream failed"));
      mockChatCompletionsCreate.mockResolvedValue({
        async *[Symbol.asyncIterator]() {
          yield { choices: [{ delta: { content: "Hello " } }] };
          yield { choices: [{ delta: { content: "from " } }] };
          yield { choices: [{ delta: { content: "Groq stream" } }] };
        }
      });

      const onChunk = jest.fn();
      const result = await client.generateContentStream("Test prompt", onChunk);

      expect(result).toBe("Hello from Groq stream");
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(1);
      expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);
      expect(onChunk).toHaveBeenCalledTimes(3);
      expect(onChunk).toHaveBeenNthCalledWith(1, "Hello ");
      expect(onChunk).toHaveBeenNthCalledWith(2, "from ");
      expect(onChunk).toHaveBeenNthCalledWith(3, "Groq stream");
    });

    it("should fallback to Gemini Sekunder stream when primary Gemini and Groq stream fail", async () => {
      mockGenerateContentStream
        .mockRejectedValueOnce(new Error("Gemini 1 stream failed")) // Gemini Utama
        .mockResolvedValueOnce({
          async *[Symbol.asyncIterator]() {
            yield { text: "Hello " };
            yield { text: "from " };
            yield { text: "Gemini 2 stream" };
          }
        }); // Gemini Sekunder

      mockChatCompletionsCreate.mockRejectedValueOnce(new Error("Groq stream failed"));

      const onChunk = jest.fn();
      const result = await client.generateContentStream("Test prompt", onChunk);

      expect(result).toBe("Hello from Gemini 2 stream");
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(2);
      expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);
      expect(onChunk).toHaveBeenCalledTimes(3);
      expect(onChunk).toHaveBeenNthCalledWith(1, "Hello ");
      expect(onChunk).toHaveBeenNthCalledWith(2, "from ");
      expect(onChunk).toHaveBeenNthCalledWith(3, "Gemini 2 stream");
    });

    it("should throw error when all three streams fail", async () => {
      mockGenerateContentStream
        .mockRejectedValueOnce(new Error("Gemini 1 stream failed"))
        .mockRejectedValueOnce(new Error("Gemini 2 stream failed"));

      mockChatCompletionsCreate.mockRejectedValueOnce(new Error("Groq stream failed"));

      const onChunk = jest.fn();
      await expect(client.generateContentStream("Test", onChunk)).rejects.toThrow(
        "AIClient Streaming Total Failure"
      );
      expect(mockGenerateContentStream).toHaveBeenCalledTimes(2);
      expect(mockChatCompletionsCreate).toHaveBeenCalledTimes(1);
    });
  });
});
