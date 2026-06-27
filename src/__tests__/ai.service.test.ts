// Mock dependencies
jest.mock("@/ai/client", () => ({
  aiClient: {
    generateContent: jest.fn(),
    generateContentStream: jest.fn(),
  },
}));

jest.mock("@/ai/loader", () => ({
  loadPrompt: jest.fn(),
}));

import aiService from "@/services/ai.service";
import { aiClient } from "@/ai/client";
import { loadPrompt } from "@/ai/loader";

const mockGenerateContent = aiClient.generateContent as jest.Mock;
const mockGenerateContentStream = aiClient.generateContentStream as jest.Mock;
const mockLoadPrompt = loadPrompt as jest.Mock;

describe("AIService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendChatMessage", () => {
    it("should construct prompt with history and message", async () => {
      const promptTemplate = "History: {{user_history}}\nMessage: {{user_message}}";
      mockLoadPrompt.mockReturnValue(promptTemplate);
      mockGenerateContent.mockResolvedValue('{"suggestion": "test"}');

      await aiService.sendChatMessage("AI: Hello\nUser: Hi", "How are you?");

      expect(mockLoadPrompt).toHaveBeenCalledWith("chat.prompt");
      const calledWith = mockGenerateContent.mock.calls[0][0];
      expect(calledWith).toBe("History: AI: Hello\nUser: Hi\nMessage: How are you?");
    });

    it("should return AI response text", async () => {
      mockLoadPrompt.mockReturnValue("{{user_history}} {{user_message}}");
      mockGenerateContent.mockResolvedValue('{"suggestion": "Halo!", "metaData": {}}');

      const result = await aiService.sendChatMessage("", "Hai");

      expect(result).toBe('{"suggestion": "Halo!", "metaData": {}}');
    });

    it("should throw error if AI returns no response", async () => {
      mockLoadPrompt.mockReturnValue("{{user_history}} {{user_message}}");
      mockGenerateContent.mockResolvedValue(undefined);

      await expect(aiService.sendChatMessage("", "Hai")).rejects.toThrow(
        "No response from AI"
      );
    });

    it("should throw error if AI client fails", async () => {
      mockLoadPrompt.mockReturnValue("{{user_history}} {{user_message}}");
      mockGenerateContent.mockRejectedValue(new Error("API key invalid"));

      await expect(aiService.sendChatMessage("", "Hai")).rejects.toThrow(
        "API key invalid"
      );
    });

    it("should replace both placeholders correctly", async () => {
      const template = "History:\n{{user_history}}\n\nUser said:\n{{user_message}}";
      mockLoadPrompt.mockReturnValue(template);
      mockGenerateContent.mockResolvedValue("response");

      await aiService.sendChatMessage("Turn 1: test", "Pesan saya");

      const calledWith = mockGenerateContent.mock.calls[0][0];
      expect(calledWith).toContain("Turn 1: test");
      expect(calledWith).toContain("Pesan saya");
      expect(calledWith).not.toContain("{{user_history}}");
      expect(calledWith).not.toContain("{{user_message}}");
    });
  });

  describe("sendChatMessageStream", () => {
    it("should construct prompt and call generateContentStream", async () => {
      const promptTemplate = "History: {{user_history}}\nMessage: {{user_message}}";
      mockLoadPrompt.mockReturnValue(promptTemplate);
      mockGenerateContentStream.mockImplementation((prompt, onChunk) => {
        onChunk("chunk 1");
        onChunk("chunk 2");
        return Promise.resolve("full streamed response");
      });

      const onChunkMock = jest.fn();
      const result = await aiService.sendChatMessageStream("AI: Hello\nUser: Hi", "How are you?", onChunkMock);

      expect(mockLoadPrompt).toHaveBeenCalledWith("chat.prompt");
      expect(mockGenerateContentStream).toHaveBeenCalled();
      expect(onChunkMock).toHaveBeenCalledTimes(2);
      expect(onChunkMock).toHaveBeenNthCalledWith(1, "chunk 1");
      expect(onChunkMock).toHaveBeenNthCalledWith(2, "chunk 2");
      expect(result).toBe("full streamed response");
    });
  });
});
