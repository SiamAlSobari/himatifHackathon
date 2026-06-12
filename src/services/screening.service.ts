import { ScreeningRequest, ScreeningResult } from "@/lib/types/screening";
import { AppThemeEnum } from "@/lib/types/theme";

export class ScreeningService {
    constructor() { }

    async calculateScreeningScore(data: ScreeningRequest): Promise<ScreeningResult> {
        const { type, answers } = data;
        let totalScore = 0;
        answers.reduce((acc, answer) => {
            totalScore += answer.score;
            return acc;
        }, totalScore);

        let theme = AppThemeEnum.CALM_BLUE;
        if (totalScore >= 0 && totalScore <= 3) {
            theme = AppThemeEnum.CALM_BLUE;
        } else if (totalScore >= 4 && totalScore <= 6) {
            theme = AppThemeEnum.WARM_YELLOW;
        } else if (totalScore >= 7 && totalScore <= 9) {
            theme = AppThemeEnum.ALERT_ORANGE;
        } else if (totalScore >= 10 && totalScore <= 12) {
            theme = AppThemeEnum.DEEP_PURPLE;
        }

        return {
            type,
            score: totalScore,
            answers,
            theme,
        };
    }
}

const screeningService = new ScreeningService();

export default screeningService;