import { AppTheme } from "./theme";

export interface AIChatResponse {
    suggestion: string;
    metaData: {
        uiTheme: AppTheme;
        isCrisis: boolean;
        needPsychologist: boolean;
    }
}