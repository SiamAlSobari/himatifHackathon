import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import consultationHistoryService from "@/services/consultation-history.service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const role = (session.user as any).role || "USER";
    const history = await consultationHistoryService.getCompletedConsultations(session.user.id, role);
    return successResponse(200, "Consultation history retrieved successfully", history);
  } catch (error) {
    console.error("Error in GET /api/konsultasi/history:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
