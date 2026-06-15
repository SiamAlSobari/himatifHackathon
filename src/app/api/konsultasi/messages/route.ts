import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get("appointmentId");

  if (!appointmentId) {
    return errorResponse(400, "Missing appointmentId");
  }

  try {
    const messages = await psychologistService.getOrCreateConsultationMessages(appointmentId);
    return successResponse(200, "Messages retrieved successfully", messages);
  } catch (error) {
    console.error("Error in GET /api/konsultasi/messages:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { appointmentId, sender, text } = await request.json();

    if (!appointmentId || !sender || !text) {
      return errorResponse(400, "Missing required fields");
    }

    // Save message via service layer
    const newMessage = await psychologistService.createConsultationMessage(appointmentId, sender, text);

    // Broadcast to Pusher for real-time delivery
    await pusherServer.trigger(
      `appointment-${appointmentId}`,
      "message-sent",
      newMessage
    );

    return successResponse(201, "Message created and broadcasted", newMessage);
  } catch (error) {
    console.error("Error in POST /api/konsultasi/messages:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
