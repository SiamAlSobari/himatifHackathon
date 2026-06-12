import { AppThemeEnum } from "./theme"

export type ScreeningRequest = {
    type: "ONBOARDING" | "DAILY",
    answers: ScreeningAnswer[],
}

export type ScreeningResult = {
    type: "ONBOARDING" | "DAILY",
    score: number,
    answers: ScreeningAnswer[],
    theme: AppThemeEnum
}

export type ScreeningAnswer = {
    qNumber: number,
    score: number,
}