import { aiClient } from "@/ai/client";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await aiClient.generateContent(body.prompt);
        return successResponse(200, "Content generated successfully", response);
    }
    catch (error) {
        console.error("Error in AI route:", error);
        return errorResponse(500, "Failed to generate content");
    }
}