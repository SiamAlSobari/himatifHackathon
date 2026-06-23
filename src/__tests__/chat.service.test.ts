// Mock semua dependencies sebelum import
jest.mock("@/ai/loader", () => ({
  loadPrompt: jest.fn().mockReturnValue("Mock prompt content"),
}));

jest.mock("@/lib/utils", () => ({
  AIResponseFormatter: jest.fn(),
}));

jest.mock("@/repositories/chatMessage.repository", () => ({
  __esModule: true,
  default: {
    getSessionChats: jest.fn(),
    createMessage: jest.fn(),
  },
}));

jest.mock("@/services/ai.service", () => ({
  __esModule: true,
  default: {
    sendChatMessage: jest.fn(),
  },
}));

jest.mock("@/repositories/screening.repository", () => ({
  __esModule: true,
  default: {
    getLatestScreeningResult: jest.fn(),
  },
}));

jest.mock("@/services/screening.service", () => ({
  __esModule: true,
  default: {
    getScreeningResultByScore: jest.fn(),
  },
}));

jest.mock("@/repositories/chatSessionRepository", () => ({
  __esModule: true,
  default: {
    getById: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

jest.mock("@/lib/pusher/pusher-server", () => ({
  pusherServer: {
    trigger: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("@/services/sessionSummary.service", () => ({
  __esModule: true,
  default: {
    createOrUpdateSummary: jest.fn(),
  },
}));

jest.mock("@/services/blockchain-sync.service", () => ({
  __esModule: true,
  default: {
    syncChatSession: jest.fn().mockResolvedValue(undefined),
  },
}));

// Import setelah mock
import chatService from "@/services/chat.service";
import chatMessageRepository from "@/repositories/chatMessage.repository";
import aiService from "@/services/ai.service";
import chatSessionRepository from "@/repositories/chatSessionRepository";
import screeningRepository from "@/repositories/screening.repository";
import screeningService from "@/services/screening.service";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { AIResponseFormatter } from "@/lib/utils";

// Type cast untuk kemudahan testing
const mockGetSessionChats = chatMessageRepository.getSessionChats as jest.Mock;
const mockCreateMessage = chatMessageRepository.createMessage as jest.Mock;
const mockSendChatMessage = aiService.sendChatMessage as jest.Mock;
const mockGetById = chatSessionRepository.getById as jest.Mock;
const mockUpdateStatus = chatSessionRepository.updateStatus as jest.Mock;
const mockGetLatestScreening = screeningRepository.getLatestScreeningResult as jest.Mock;
const mockGetScreeningResult = screeningService.getScreeningResultByScore as jest.Mock;
const mockPusherTrigger = pusherServer.trigger as jest.Mock;
const mockFormatResponse = AIResponseFormatter as jest.Mock;

const validAIResponse = {
  suggestion: "Halo, apa kabar?",
  finalConclusion: null,
  metaData: {
    uiTheme: "calm_blue",
    isCrisis: false,
    needPsychologist: false,
    isSessionEnded: false,
    analysis: {
      anxietyLevel: "Rendah",
      insomniaLevel: "Rendah",
      depressionLevel: "Rendah",
      aiValidationAdvice: "Tetap semangat!",
    },
  },
};

describe("ChatService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // Bug #1: Error handling - Thinking forever
  // ==========================================
  describe("Bug #1: processAIResponse error handling", () => {
    it("should send Pusher error event when AI call fails", async () => {
      // Setup: session exists, no history
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");

      // AI call gagal
      mockSendChatMessage.mockRejectedValue(new Error("Gemini API timeout"));

      await chatService.sendMessage("user-1", "session-1", "Hai");

      // Tunggu fire-and-forget selesai
      await new Promise((r) => setTimeout(r, 100));

      // Pastikan Pusher error event dikirim
      expect(mockPusherTrigger).toHaveBeenCalledWith(
        "user-user-1",
        "chat-finished",
        {
          status: "error",
          name: "calm_blue",
        }
      );
    });

    it("should save error message to DB when AI call fails", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");
      mockSendChatMessage.mockRejectedValue(new Error("API Error"));

      await chatService.sendMessage("user-1", "session-1", "Hai");
      await new Promise((r) => setTimeout(r, 100));

      // Pastikan error message disimpan ke DB
      expect(mockCreateMessage).toHaveBeenCalledWith(
        "session-1",
        "ASSISTANT",
        "Maaf, Very AI sedang mengalami gangguan. Silakan coba kirim pesan lagi nanti.",
        {
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
        }
      );
    });

    it("should send Pusher error event when JSON parsing fails", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");

      // AI mengembalikan response yang bukan JSON
      mockSendChatMessage.mockResolvedValue("Ini bukan JSON valid");
      mockFormatResponse.mockImplementation(() => {
        throw new Error("Invalid JSON format");
      });

      await chatService.sendMessage("user-1", "session-1", "Hai");
      await new Promise((r) => setTimeout(r, 100));

      expect(mockPusherTrigger).toHaveBeenCalledWith(
        "user-user-1",
        "chat-finished",
        { status: "error", name: "calm_blue" }
      );
    });

    it("should save AI response and send success Pusher event on success", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([
        { role: "USER", content: "Hai" },
      ]);
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "Apa kabar?");
      await new Promise((r) => setTimeout(r, 100));

      // Pastikan AI response disimpan
      expect(mockCreateMessage).toHaveBeenCalledWith(
        "session-1",
        "ASSISTANT",
        "Halo, apa kabar?",
        {
          uiTheme: "calm_blue",
          isCrisis: false,
          needPsychologist: false,
          isSessionEnded: false,
          analysis: {
            anxietyLevel: "Rendah",
            insomniaLevel: "Rendah",
            depressionLevel: "Rendah",
            aiValidationAdvice: "Tetap semangat!",
          },
          finalConclusion: null,
        }
      );

      // Pastikan Pusher success event dikirim
      expect(mockPusherTrigger).toHaveBeenCalledWith(
        "user-user-1",
        "chat-finished",
        {
          status: "completed",
          name: "calm_blue",
        }
      );
    });
  });

  // ==========================================
  // Bug #3: Pesan pertama user tidak disimpan
  // ==========================================
  describe("Bug #3: First message persistence", () => {
    it("should save user's first message to DB if message is not empty", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]); // Empty = first message
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "Halo, aku butuh bantuan");
      await new Promise((r) => setTimeout(r, 100));

      // Pastikan pesan pertama user disimpan
      expect(mockCreateMessage).toHaveBeenCalledWith(
        "session-1",
        "USER",
        "Halo, aku butuh bantuan",
        null
      );
    });

    it("should NOT save empty first message to DB", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "");
      await new Promise((r) => setTimeout(r, 100));

      // Empty message tidak boleh disimpan sebagai USER message
      const userCalls = mockCreateMessage.mock.calls.filter(
        (call: unknown[]) => call[1] === "USER"
      );
      expect(userCalls).toHaveLength(0);
    });

    it("should still send trigger.prompt for first message", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue({ score: 5 });
      mockGetScreeningResult.mockResolvedValue("alert_orange");
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "Aku cemas");
      await new Promise((r) => setTimeout(r, 100));

      // Pastikan sendChatMessage dipanggil
      expect(mockSendChatMessage).toHaveBeenCalledWith(
        "", // empty history
        "Mock prompt content" // trigger prompt
      );
    });
  });

  // ==========================================
  // Bug #4: Return value consistency
  // ==========================================
  describe("Bug #4: Consistent return value", () => {
    it("should return status object for first message (not null)", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue({ score: 3 });
      mockGetScreeningResult.mockResolvedValue("calm_blue");
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      const result = await chatService.sendMessage("user-1", "session-1", "Hai");

      // Bug fix #4: Harus return object, bukan null
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("status", "processing");
      expect(result).toHaveProperty("sessionId", "session-1");
    });

    it("should return status object for subsequent messages", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([
        { role: "ASSISTANT", content: "Halo" },
        { role: "USER", content: "Hai" },
      ]);
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-2" });

      const result = await chatService.sendMessage("user-1", "session-1", "Aku sedih");

      expect(result).not.toBeNull();
      expect(result).toHaveProperty("status", "processing");
    });
  });

  // ==========================================
  // Bug #6: Turn count accuracy
  // ==========================================
  describe("Bug #6: Turn count", () => {
    it("should complete session when user reaches 7 messages", async () => {
      const sevenUserMessages = Array.from({ length: 7 }, (_, i) => ({
        role: "USER",
        content: `Message ${i + 1}`,
      }));

      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue(sevenUserMessages);
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "Pesan ke 8");
      await new Promise((r) => setTimeout(r, 100));

      expect(mockUpdateStatus).toHaveBeenCalledWith("session-1", "COMPLETED");
    });

    it("should NOT complete session when user has less than 7 messages", async () => {
      const fiveUserMessages = Array.from({ length: 5 }, (_, i) => ({
        role: "USER",
        content: `Message ${i + 1}`,
      }));

      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue(fiveUserMessages);
      mockSendChatMessage.mockResolvedValue(JSON.stringify(validAIResponse));
      mockFormatResponse.mockReturnValue(validAIResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "Pesan ke 6");
      await new Promise((r) => setTimeout(r, 100));

      expect(mockUpdateStatus).not.toHaveBeenCalled();
    });

    it("should complete session when isSessionEnded is true", async () => {
      const endedResponse = {
        ...validAIResponse,
        metaData: { ...validAIResponse.metaData, isSessionEnded: true },
      };

      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([
        { role: "USER", content: "Hai" },
      ]);
      mockSendChatMessage.mockResolvedValue(JSON.stringify(endedResponse));
      mockFormatResponse.mockReturnValue(endedResponse);
      mockCreateMessage.mockResolvedValue({ id: "msg-1" });

      await chatService.sendMessage("user-1", "session-1", "Aku baik-baik saja");
      await new Promise((r) => setTimeout(r, 100));

      expect(mockUpdateStatus).toHaveBeenCalledWith("session-1", "COMPLETED");
    });
  });

  // ==========================================
  // Additional: Session validation
  // ==========================================
  describe("Session validation", () => {
    it("should throw error if session not found", async () => {
      mockGetById.mockResolvedValue(null);

      await expect(
        chatService.sendMessage("user-1", "invalid-session", "Hai")
      ).rejects.toThrow("Chat session not found");
    });

    it("should throw error if no screening result for first message", async () => {
      mockGetById.mockResolvedValue({ id: "session-1", status: "ACTIVE" });
      mockGetSessionChats.mockResolvedValue([]);
      mockGetLatestScreening.mockResolvedValue(null);

      await expect(
        chatService.sendMessage("user-1", "session-1", "Hai")
      ).rejects.toThrow("No screening result found");
    });
  });
});
