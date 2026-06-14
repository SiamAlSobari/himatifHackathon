import { AppTheme } from "./theme";

export interface AIChatResponse {
    suggestion: string;
    finalConclusion: string | null;
    metaData: {
        uiTheme: AppTheme;
        isCrisis: boolean;
        needPsychologist: boolean;
        isSessionEnded: boolean;
        analysis: {
            anxietyLevel: "Rendah" | "Sedang" | "Tinggi";
            insomniaLevel: "Rendah" | "Sedang" | "Tinggi";
            depressionLevel: "Rendah" | "Sedang" | "Tinggi";
            aiValidationAdvice: string;
        }
    }
}
