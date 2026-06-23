// Mock dependencies
jest.mock("@/lib/constants/env", () => ({
  envConfig: {
    GeminiApiKey: "test-api-key",
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

// Import after mock
import { AIClient } from "@/ai/client";

describe("AIClient", () => {
  let client: AIClient;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset singleton
    (AIClient as unknown as Record<string, unknown>).instance = undefined;

    const genai = require("@google/genai");
    mockGenerateContent = genai.__mockGenerateContent;

    client = new AIClient();
  });

  describe("generateContent", () => {
    it("should call primary model first", async () => {
      mockGenerateContent.mockResolvedValue({ text: "Hello from AI" });

      const result = await client.generateContent("Test prompt");

      expect(result).toBe("Hello from AI");
      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBeTruthy();
      expect(callArgs.contents).toBe("Test prompt");
    });

    it("should fallback to secondary model when primary fails", async () => {
      mockGenerateContent
        .mockRejectedValueOnce(new Error("Primary model failed"))
        .mockResolvedValueOnce({ text: "Fallback response" });

      const result = await client.generateContent("Test prompt");

      expect(result).toBe("Fallback response");
      expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    });

    it("should throw error when both models fail", async () => {
      mockGenerateContent
        .mockRejectedValueOnce(new Error("Primary failed"))
        .mockRejectedValueOnce(new Error("Fallback failed"));

      await expect(client.generateContent("Test")).rejects.toThrow(
        "AIClient Total Failure"
      );
    });

    it("should throw error when API key is missing", async () => {
      // Override envConfig mock
      const envModule = require("@/lib/constants/env");
      const originalKey = envModule.envConfig.GeminiApiKey;
      envModule.envConfig.GeminiApiKey = "";

      // Create new client to pick up empty key
      const newClient = new AIClient();

      await expect(newClient.generateContent("Test")).rejects.toThrow(
        "GeminiApiKey tidak ditemukan"
      );

      // Restore
      envModule.envConfig.GeminiApiKey = originalKey;
    });

    it("should pass config with temperature and maxOutputTokens", async () => {
      mockGenerateContent.mockResolvedValue({ text: "response" });

      await client.generateContent("Test");

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.config).toBeTruthy();
      expect(callArgs.config.temperature).toBe(0.7);
      expect(callArgs.config.maxOutputTokens).toBe(2048);
      expect(callArgs.config.systemInstruction).toBeTruthy();
    });
  });
});
