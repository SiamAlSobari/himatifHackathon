
export const screeningQuestions: Question[] = [
    {
        qNumber: 1,
        text: "Dalam dua minggu terakhir, seberapa sering kamu merasa kehabisan energi atau burnout bahkan sebelum hari dimulai?",
    },
    {
        qNumber: 2,
        text: "Seberapa sering kamu merasa kesulitan fokus saat mengerjakan tugas atau mengejar deadline karena isi kepala terasa terlalu penuh?"
    },
    {
        qNumber: 3,
        text: "Meskipun sedang bersama teman-teman, seberapa sering kamu merasa sendirian atau merasa tidak ada yang benar-benar mengerti bebanmu?"
    },
    {
        qNumber: 4,
        text: "Seberapa sering pikiran yang berisik (overthinking) membuat jam tidurmu berantakan atau membuatmu sulit beristirahat dengan tenang?"
    }
]

export const answerOptions = [
    {
        text: "Tidak Pernah",
        score: 0,
    },
    {
        text: "Kadang-kadang / Jarang",
        score: 1,
    },
    {
        text: "Sering",
        score: 2,
    },
    {
        text: "Selalu",
        score: 3,
    },
]


export type Question = {
    qNumber: number,
    text: string,
}