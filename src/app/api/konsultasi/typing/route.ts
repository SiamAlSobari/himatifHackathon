import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { appointmentId, sender, isTyping } = await request.json();

    if (!appointmentId || !sender || typeof isTyping !== "boolean") {
      return errorResponse(400, "Missing required fields");
    }

    // Broadcast to Pusher for real-time delivery
    await pusherServer.trigger(
      `appointment-${appointmentId}`,
      "typing-status",
      {
        sender,
        isTyping,
      }
    );

    return successResponse(200, "Typing status broadcasted successfully", null);
  } catch (error) {
    console.error("Error in POST /api/konsultasi/typing:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
