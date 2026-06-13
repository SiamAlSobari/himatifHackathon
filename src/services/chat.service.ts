import { aiClient } from "@/ai/client";
import { loadPrompt } from "@/ai/loader";
import { AIResponseFormatter } from "@/lib/utils";

export class ChatService {
    async sendMessage(userId: string, message: string) {
        try {
            const userHistories = [
                {
                    number: 1,
                    AI: "Hai! Dari skor yang kamu isi barusan, sepertinya hari ini rasanya lagi lumayan berat ya. Ada yang mau diceritain pelan-pelan ke aku?",
                    User: "Iya nih, tugas bikin REST API pakai Golang numpuk banget buat project TEFA. Udah gitu ada bug di fungsi relative time format yang dari kemarin nggak beres-beres. Rasanya capek banget."
                },
                {
                    number: 2,
                    AI: "Pasti capek banget ya menatap layar terus-terusan, pikiran juga pasti lagi penuh banget karena harus nyari letak error-nya di tengah deadline. Wajar kok kalau kamu merasa burnout. Kalau lagi mentok begini, apa hal kecil yang biasanya bisa bikin kepalamu agak dingin?",
                    User: "Biasanya aku baca manga bentar sih, baca 'Kill Blue' gitu buat refreshing. Tapi kalau sekarang mau buka komik aja malah ngerasa bersalah karena tugasnya belum kelar."
                },
                {
                    number: 3,
                    AI: "Rasa bersalah itu muncul karena kamu orang yang sangat bertanggung jawab sama tugasmu. Tapi ingat, istirahat itu bukan lari dari tanggung jawab, lho. Kadang otak kita butuh jeda supaya bisa ngelihat letak error-nya dengan lebih jernih. Mau coba kasih waktu buat dirimu sendiri 15 menit aja tanpa mikirin kode?",
                    User: "Bener juga sih. Kayaknya aku emang terlalu maksa sampai kurang tidur. Ya udah, aku coba rehat bentar deh."
                }
            ];

            // Opsional: Cara cepat mengubahnya menjadi string untuk di-inject ke prompt
            const formattedHistory = userHistories
                .map(chat => `--- Turn ${chat.number} ---\nAI: ${chat.AI}\nUser: ${chat.User}`)
                .join('\n\n');

            console.log(formattedHistory);
            let userPrompt = message;
            const isFirstMessage = userHistories.length === 0;
            if (isFirstMessage) {
                userPrompt = loadPrompt("trigger.prompt");
            }

            const raw = loadPrompt("chat.prompt");
            const prompt = raw.replace("{{user_history}}", formattedHistory).replace("{{user_message}}", message);

            const response = await aiClient.generateContent(prompt);
            if (!response) {
                throw new Error("No response from AI");
            }

            return AIResponseFormatter(response);
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }
}

const chatService = new ChatService();

export default chatService;