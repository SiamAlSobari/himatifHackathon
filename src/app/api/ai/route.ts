import { aiClient } from "@/ai/client";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const response = await aiClient.generateContent(body.prompt);
        return new Response(
            JSON.stringify({ data: response }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    }
    catch (error) {
        console.error("Error in AI route:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}