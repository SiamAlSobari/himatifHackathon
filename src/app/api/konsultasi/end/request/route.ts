import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { appointmentId, requester } = await request.json();

    if (!appointmentId || !requester || (requester !== "user" && requester !== "psychologist")) {
      return errorResponse(400, "appointmentId dan requester (user/psychologist) wajib diisi");
    }

    await psychologistService.requestEndSession(appointmentId, requester);
    
    return successResponse(200, "End session request broadcasted", null);
  } catch (error: any) {
    console.error("[/api/konsultasi/end/request] error:", error);
    return errorResponse(500, error.message || "Failed to request end session");
  }
}
