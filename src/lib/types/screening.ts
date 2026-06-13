import { ScreeningType } from "../../../generated/prisma/enums"
import { AppThemeEnum } from "./theme"

export type ScreeningRequest = {
    type: ScreeningType,
    answers: ScreeningAnswer[],
}

export type ScreeningResult = {
    type: ScreeningType,
    score: number,
    answers: ScreeningAnswer[],
    theme: AppThemeEnum
}

export type ScreeningAnswer = {
    qNumber: number,
    score: number,
}