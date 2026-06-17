import { db } from "@/lib/db";
import { ChatMessageRole } from "../../generated/prisma/enums";

export class ChatMessageRepository {
    async getSessionChats(sessionId: string) {
        return await db.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: "asc" },
        })
    }

    async createMessage(sessionId: string, role: ChatMessageRole, content: string, metaData: any) {
        return await db.chatMessage.create({
            data: {
                sessionId,
                role,
                content: content || "",
                metaData
            }
        })
    }

    async deleteMessagesBySessionId(sessionId: string) {
        return await db.chatMessage.deleteMany({
            where: { sessionId }
        })
    }
}

export const chatMessageRepository = new ChatMessageRepository();
export default chatMessageRepository;