
export const screeningQuestions: Question[] = [
    {
        qNumber: 1,
        text: "(DASS-13) Merasa sedih dan depresi.",
    },
    {
        qNumber: 2,
        text: "(DASS-15) Kelelahan.",
    },
    {
        qNumber: 3,
        text: "(DASS-28) Mudah panik.",
    },
    {
        qNumber: 4,
        text: "(DASS-33) Berada pada keadaan tegang.",
    },
    {
        qNumber: 5,
        text: "(PHQ-1) Kurang berminat atau kesenangan dalam melakukan sesuatu.",
    },
    {
        qNumber: 6,
        text: "(GAD-1) Merasa gugup, cemas, atau tegang.",
    },
    {
        qNumber: 7,
        text: "(GAD-6) Merasa takut seolah sesuatu yang buruk akan terjadi.",
    }
]

export const answerOptions = [
    {
        text: "Tidak pernah",
        score: 0,
    },
    {
        text: "Kadang-kadang",
        score: 1,
    },
    {
        text: "Sering",
        score: 2,
    },
    {
        text: "Hampir setiap saat",
        score: 3,
    },
]


export type Question = {
    qNumber: number,
    text: string,
}