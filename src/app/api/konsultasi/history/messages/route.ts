import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import consultationHistoryService from "@/services/consultation-history.service";

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
    const messages = await consultationHistoryService.getConsultationMessages(appointmentId, session.user.id);
    return successResponse(200, "Messages retrieved successfully", messages);
  } catch (error) {
    console.error("Error in GET /api/konsultasi/history/messages:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
