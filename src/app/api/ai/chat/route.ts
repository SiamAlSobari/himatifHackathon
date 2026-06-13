import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import chatService from "@/services/chat.service";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return errorResponse(401, "Unauthorized");
    }

    const { message, sessionId } = await request.json();
    try {
        const result = await chatService.sendMessage(session.user.id, sessionId, message);
        return successResponse(200, "AI response generated successfully", result);
    }
    catch (error) {
        return errorResponse(500, "Failed to generate AI response: " + (error instanceof Error ? error.message : "Unknown error"));
    }
}