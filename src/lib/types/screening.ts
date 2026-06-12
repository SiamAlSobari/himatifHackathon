export type ScreeningResult = {
    type: "ONBOARDING" | "DAILY",
    score: number,
    answers: ScreeningAnswer[],
}

export type ScreeningAnswer = {
    qNumber: number,
    score: number,
}