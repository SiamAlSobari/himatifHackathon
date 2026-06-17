import { ScreeningRequest, ScreeningResult } from "@/lib/types/screening";
import { AppThemeEnum } from "@/lib/types/theme";
import screeningRepository from "@/repositories/screening.repository";

export class ScreeningService {
    constructor() { }

    async getScreeningResultByScore(score: number): Promise<AppThemeEnum> {
        let theme = AppThemeEnum.CALM_BLUE;
        if (score >= 0 && score <= 4) {
            theme = AppThemeEnum.CALM_BLUE;
        } else if (score >= 5 && score <= 9) {
            theme = AppThemeEnum.WARM_YELLOW;
        } else if (score >= 10 && score <= 13) {
            theme = AppThemeEnum.ALERT_ORANGE;
        } else if (score >= 14 && score <= 21) {
            theme = AppThemeEnum.DEEP_PURPLE;
        }

        return theme;
    }

    async calculateScreeningScore(data: ScreeningRequest): Promise<ScreeningResult> {
        const { type, answers } = data;
        let totalScore = 0;
        answers.reduce((acc, answer) => {
            totalScore += answer.score;
            return acc;
        }, totalScore);

        let theme = AppThemeEnum.CALM_BLUE;
        if (totalScore >= 0 && totalScore <= 4) {
            theme = AppThemeEnum.CALM_BLUE;
        } else if (totalScore >= 5 && totalScore <= 9) {
            theme = AppThemeEnum.WARM_YELLOW;
        } else if (totalScore >= 10 && totalScore <= 13) {
            theme = AppThemeEnum.ALERT_ORANGE;
        } else if (totalScore >= 14 && totalScore <= 21) {
            theme = AppThemeEnum.DEEP_PURPLE;
        }

        return {
            type,
            score: totalScore,
            answers,
            theme,
        };
    }

    async saveScreeningResult(userId: string, result: ScreeningResult) {
        try {
            const { type, score, answers } = result;
            const createdResult = await screeningRepository.createScreeningResult(
                userId,
                type,
                score,
                JSON.stringify(answers)
            );
            if (!createdResult) {
                throw new Error("Failed to create screening result");
            }

            return createdResult;
        } catch (error) {
            console.error("Error saving screening result:", error);
            throw new Error("Failed to save screening result");
        }
    }

    async checkDailyScreeningStatus(userId: string): Promise<boolean> {
        const latestScreening = await screeningRepository.getLatestScreeningResult(userId);
        if (!latestScreening) {
            return false;
        }

        const today = new Date();
        const screeningDate = new Date(latestScreening.createdAt);

        return (
            screeningDate.getFullYear() === today.getFullYear() &&
            screeningDate.getMonth() === today.getMonth() &&
            screeningDate.getDate() === today.getDate()
        );
    }

    getDepressionCategory(score: number): "Normal" | "Ringan" | "Sedang" | "Parah" | "Sangat Parah" {
        if (score <= 4) {
            return "Normal";
        } else if (score <= 9) {
            return "Ringan";
        } else if (score <= 13) {
            return "Sedang";
        } else if (score <= 17) {
            return "Parah";
        } else {
            return "Sangat Parah";
        }
    }
}

const screeningService = new ScreeningService();
export default screeningService;