import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import chatSessionService from "@/services/chat-session.service";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return errorResponse(401, "Unauthorized");
    }

    try {
        const createdChatSession = await chatSessionService.createChatSession(session.user?.id);
        return successResponse(201, "AI response generated successfully", createdChatSession);
    } catch (error) {
        console.error("Error in chat session route:", error);
        return errorResponse(500, "Internal Server Error" + (error instanceof Error ? `: ${error.message}` : ""));
    }
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return errorResponse(401, "Unauthorized");
    }

    try {
        const activeChatSession = await chatSessionService.getActiveChatSession(session.user?.id || "")
        if (!activeChatSession) {
            return errorResponse(404, "No active chat session found");
        }
        return successResponse(200, "Active chat session retrieved successfully", activeChatSession);
    } catch (error) {
        console.error("Error in chat session route:", error);
        return successResponse(200, "No active chat session found", null);
    }
}