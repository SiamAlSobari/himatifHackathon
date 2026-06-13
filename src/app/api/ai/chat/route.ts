import { successResponse } from "@/lib/response";
import chatService from "@/services/chat.service";

export async function POST(request: Request) {
    try {
        const result = await chatService.sendMessage("", "Kok rasanya aku pengin bundir aja deh");
        return successResponse(200, "AI response generated successfully", result);
    }
    catch (error) {
        console.error("Error in AI route:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate content" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}