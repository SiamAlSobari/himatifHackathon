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

    const updated = await psychologistService.completeAppointment(appointmentId, session.user.id);
    
    return successResponse(200, "Sesi konsultasi diselesaikan", updated);
  } catch (error: any) {
    console.error("[/api/konsultasi/end/confirm] error:", error);
    return errorResponse(500, error.message || "Failed to confirm end session");
  }
}
