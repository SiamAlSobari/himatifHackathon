import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import chatSessionService from "@/services/chat-session.service";
import chatService from "@/services/chat.service";
import chatSessionRepository from "@/repositories/chatSessionRepository";
import screeningRepository from "@/repositories/screening.repository";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return errorResponse(401, "Unauthorized");
    }

    try {
        // Cek jika ada session yang aktif
        const activeSession = await chatSessionService.getActiveChatSession(userId);
        if (activeSession) {
            return errorResponse(400, "Sesi aktif sudah ada");
        }

        // Cek jika dalam cooldown
        const latestCompleted = await chatSessionRepository.getLatestCompletedSession(userId);
        if (latestCompleted) {
            const now = new Date().getTime();
            const completedTime = new Date(latestCompleted.updatedAt).getTime();
            const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 jam
            if (now - completedTime < cooldownPeriod) {
                return errorResponse(403, "Anda masih dalam masa cooldown");
            }
        }

        const createdChatSession = await chatSessionService.createChatSession(userId);
        
        // Kirim pesan kosong pertama untuk memicu sapaan AI (menggunakan trigger.prompt di background)
        await chatService.sendMessage(userId, createdChatSession.id, "");

        return successResponse(201, "Sesi berhasil dibuat", createdChatSession);
    } catch (error) {
        console.error("Error in chat session route:", error);
        return errorResponse(500, "Internal Server Error" + (error instanceof Error ? `: ${error.message}` : ""));
    }
}

export async function GET(request: Request) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
        return errorResponse(401, "Unauthorized");
    }

    try {
        const activeChatSession = await chatSessionService.getActiveChatSession(userId);
        const latestScreening = await screeningRepository.getLatestScreeningResult(userId);
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { isOnboarded: true }
        });

        let cooldown = null;

        if (!activeChatSession) {
            const latestCompleted = await chatSessionRepository.getLatestCompletedSession(userId);
            if (latestCompleted) {
                const now = new Date().getTime();
                const completedTime = new Date(latestCompleted.updatedAt).getTime();
                const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 jam
                
                if (now - completedTime < cooldownPeriod) {
                    const remainingMs = cooldownPeriod - (now - completedTime);
                    const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));
                    const completedSessionWithMessages = await chatSessionRepository.getById(latestCompleted.id);
                    cooldown = {
                        active: true,
                        remainingHours,
                        completedSessionId: latestCompleted.id,
                        completedSession: completedSessionWithMessages
                    };
                } else {
                    cooldown = {
                        active: false,
                        remainingHours: 0,
                        completedSessionId: null
                    };
                }
            } else {
                cooldown = {
                    active: false,
                    remainingHours: 0,
                    completedSessionId: null
                };
            }
        }

        return successResponse(200, "Active chat session retrieved successfully", {
            activeSession: activeChatSession,
            cooldown,
            latestScreening,
            isOnboarded: user?.isOnboarded ?? false
        });
    } catch (error) {
        console.error("Error in chat session route:", error);
        return errorResponse(500, "Internal Server Error" + (error instanceof Error ? `: ${error.message}` : ""));
    }
}