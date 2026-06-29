import { AppTheme } from "./theme";

export interface ChatMessage {
    id: string;
    sessionId: string;
    role: "USER" | "ASSISTANT";
    content: string;
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
        };
    } | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ChatSession {
    id: string;
    userId: string;
    status: "ACTIVE" | "SEALED" | "COMPLETED";
    createdAt: Date | string;
    updatedAt: Date | string;
    ipfsCid?: string | null;
    txHash?: string | null;
}

export interface ChatSessionWithMessages extends ChatSession {
    chatMessages: ChatMessage[];
    user?: {
        name: string | null;
        image: string | null;
    };
    sessionSummary?: {
        id: string;
        chatSessionId: string;
        summary: string;
        createdAt: Date | string;
        updatedAt: Date | string;
    } | null;
}

export interface Screening {
    id: string;
    userId: string;
    score: number;
    type: "ONBOARDING" | "DAILY";
    answer: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ChatSessionData {
    activeSession: ChatSessionWithMessages | null;
    cooldown: {
        active: boolean;
        remainingHours: number;
        completedSessionId: string | null;
        completedSession?: ChatSessionWithMessages | null;
    } | null;
    latestScreening: Screening | null;
    isOnboarded?: boolean;
    hasScreenedToday?: boolean;
    history: ChatSessionWithMessages[];
    jenisKelamin?: string | null;
}
