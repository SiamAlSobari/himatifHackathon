import { AIResponseFormatter } from "@/lib/utils";

describe("AIResponseFormatter", () => {
  // Helper untuk buat valid AI response JSON
  const validResponse = {
    suggestion: "Hai, gimana kabarmu?",
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
        aiValidationAdvice: "Tetap jaga kesehatan ya!",
      },
    },
  };

  describe("Valid JSON parsing", () => {
    it("should parse clean JSON string", () => {
      const input = JSON.stringify(validResponse);
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
      expect(result.metaData.uiTheme).toBe("calm_blue");
    });

    it("should parse JSON wrapped in ```json code block", () => {
      const input = "```json\n" + JSON.stringify(validResponse) + "\n```";
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
    });

    it("should parse JSON with text before and after", () => {
      const input = "Ini respons saya:\n" + JSON.stringify(validResponse) + "\nSemoga membantu!";
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
    });

    it("should parse JSON with <think> tags (closed)", () => {
      const input = "<think>\nSaya perlu berpikir dulu...\n</think>\n" + JSON.stringify(validResponse);
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
    });

    it("should parse JSON with unclosed <think> tag", () => {
      const input = "<think>\nSaya perlu berpikir dulu...\n" + JSON.stringify(validResponse);
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
    });

    it("should parse JSON with markdown and <think> mixed", () => {
      const input = "<think>Analisis...</think>\n```json\n" + JSON.stringify(validResponse) + "\n```";
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
    });

    it("should handle response with balasan_ai field", () => {
      const responseWithBalasan = {
        balasan_ai: "Halo sayang!",
        metaData: {
          uiTheme: "warm_yellow",
          isCrisis: false,
          needPsychologist: false,
          isSessionEnded: false,
          analysis: {
            anxietyLevel: "Rendah",
            insomniaLevel: "Rendah",
            depressionLevel: "Rendah",
            aiValidationAdvice: "",
          },
        },
      };
      const result = AIResponseFormatter<typeof responseWithBalasan>(
        JSON.stringify(responseWithBalasan)
      );
      expect(result.balasan_ai).toBe("Halo sayang!");
    });
  });

  describe("Error handling", () => {
    it("should throw error for empty string", () => {
      expect(() => AIResponseFormatter("")).toThrow(
        "AIResponseFormatter received empty or invalid input"
      );
    });

    it("should throw error for null/undefined input", () => {
      expect(() => AIResponseFormatter(null as unknown as string)).toThrow(
        "AIResponseFormatter received empty or invalid input"
      );
    });

    it("should throw error for plain text (no JSON)", () => {
      expect(() => AIResponseFormatter("Ini cuma teks biasa")).toThrow("Invalid JSON format");
    });

    it("should throw error for invalid JSON syntax", () => {
      expect(() => AIResponseFormatter("{invalid json}")).toThrow("Invalid JSON format");
    });

    it("should throw error for JSON missing required fields", () => {
      const incomplete = JSON.stringify({ randomField: "value" });
      expect(() => AIResponseFormatter(incomplete)).toThrow(
        "Parsed JSON missing required fields"
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle JSON with extra whitespace", () => {
      const input = "   \n  " + JSON.stringify(validResponse) + "  \n  ";
      const result = AIResponseFormatter<typeof validResponse>(input);
      expect(result.suggestion).toBe("Hai, gimana kabarmu?");
    });

    it("should handle JSON with nested objects", () => {
      const complexResponse = {
        ...validResponse,
        metaData: {
          ...validResponse.metaData,
          analysis: {
            anxietyLevel: "Tinggi",
            insomniaLevel: "Sedang",
            depressionLevel: "Rendah",
            aiValidationAdvice: "Coba relaksasi ya",
          },
        },
      };
      const result = AIResponseFormatter<typeof complexResponse>(
        JSON.stringify(complexResponse)
      );
      expect(result.metaData.analysis.anxietyLevel).toBe("Tinggi");
    });

    it("should handle crisis response correctly", () => {
      const crisisResponse = {
        ...validResponse,
        metaData: {
          ...validResponse.metaData,
          isCrisis: true,
          uiTheme: "deep_purple",
        },
      };
      const result = AIResponseFormatter<typeof crisisResponse>(
        JSON.stringify(crisisResponse)
      );
      expect(result.metaData.isCrisis).toBe(true);
      expect(result.metaData.uiTheme).toBe("deep_purple");
    });
  });
});
