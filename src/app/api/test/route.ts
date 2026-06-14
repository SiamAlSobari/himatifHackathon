import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { errorResponse } from "@/lib/response";

export async function POST(request: Request) {
    try {
        const session = await auth();
        await pusherServer.trigger(
            `user-${session?.user?.id}`,
            "chat-finished",
            {
                name: session?.user?.name,
                status: "completed",
            }
        );

        return new Response("Hello, World!");

    } catch (error) {
        console.error("Error in /api/test:", error);
        return errorResponse(500, "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error"));
    }
}