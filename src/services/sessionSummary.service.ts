import sessionSummaryRepository from "@/repositories/sessionSummary.repository";

export class SessionSummaryService {
    async createOrUpdateSummary(chatSessionId: string, summary: string) {
        if (!summary) return null;
        return await sessionSummaryRepository.upsert(chatSessionId, summary);
    }

    async getLatestSummary(userId: string) {
        return await sessionSummaryRepository.getLatestByUserId(userId);
    }
}

export const sessionSummaryService = new SessionSummaryService();
export default sessionSummaryService;
