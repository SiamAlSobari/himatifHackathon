import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { errorResponse, successResponse } from "@/lib/response";
import appointmentRepository from "@/repositories/appointment.repository";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { appointmentId, role, type } = await request.json();

    if (!appointmentId || !role || !type) {
      return errorResponse(400, "Missing required fields");
    }

    // Update presence in database
    try {
      const isOnline = type !== "leave";
      await appointmentRepository.updatePresence(appointmentId, role, isOnline);
    } catch (err) {
      console.error("Failed to update database presence status:", err);
    }

    // Broadcast to Pusher for real-time delivery
    await pusherServer.trigger(
      `appointment-${appointmentId}`,
      "presence-status",
      {
        sender: role,
        type, // "join" | "greet" | "leave"
      }
    );

    return successResponse(200, "Presence status broadcasted successfully", null);
  } catch (error) {
    console.error("Error in POST /api/konsultasi/presence:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
