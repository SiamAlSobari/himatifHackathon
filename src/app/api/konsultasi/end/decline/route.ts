import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { appointmentId } = await request.json();

    if (!appointmentId) {
      return errorResponse(400, "appointmentId wajib diisi");
    }

    await psychologistService.declineEndSession(appointmentId);
    
    return successResponse(200, "End session request declined", null);
  } catch (error: any) {
    console.error("[/api/konsultasi/end/decline] error:", error);
    return errorResponse(500, error.message || "Failed to decline end session");
  }
}
