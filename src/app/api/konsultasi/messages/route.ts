import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";
import appointmentRepository from "@/repositories/appointment.repository";
import notificationService from "@/services/notification.service";

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

    // Create notification for recipient
    try {
      const appointment = await appointmentRepository.getAppointmentWithParticipants(appointmentId);
      if (appointment) {
        let recipientId = "";
        let senderName = "";
        if (sender === "psychologist") {
          recipientId = appointment.userId;
          senderName = appointment.psychologistProfile.user.name || appointment.psychologistProfile.user.email || "Psikolog";
        } else {
          recipientId = appointment.psychologistProfile.userId;
          senderName = appointment.user.name || appointment.user.email || "Klien";
        }

        // Check if recipient is active on the page (within last 60 seconds)
        let isRecipientActive = false;
        const nowTime = Date.now();
        if (sender === "psychologist") {
          if (appointment.userLastActiveAt) {
            const lastActive = new Date(appointment.userLastActiveAt).getTime();
            isRecipientActive = (nowTime - lastActive) < 60000;
          }
        } else {
          if (appointment.psychologistLastActiveAt) {
            const lastActive = new Date(appointment.psychologistLastActiveAt).getTime();
            isRecipientActive = (nowTime - lastActive) < 60000;
          }
        }

        if (recipientId && !isRecipientActive) {
          await notificationService.createNotification(recipientId, {
            title: `Pesan baru dari ${senderName}`,
            message: text.length > 50 ? `${text.substring(0, 50)}...` : text,
            type: "UNREAD_CHAT",
            metaData: {
              appointmentId,
              sender,
              senderName,
            }
          });
        }
      }
    } catch (err) {
      console.error("Failed to create chat message notification:", err);
    }

    return successResponse(201, "Message created and broadcasted", newMessage);
  } catch (error) {
    console.error("Error in POST /api/konsultasi/messages:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
