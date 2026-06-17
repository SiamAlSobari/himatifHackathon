import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  const role = (session.user as any).role;
  if (role !== "PSYCHOLOGY") {
    return errorResponse(403, "Forbidden - Hanya psikolog yang dapat mengakses halaman ini");
  }

  try {
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get("appointmentId") || undefined;

    const data = await psychologistService.getPsychologistConsultationSession(session.user.id, appointmentId);
    
    return successResponse(200, "Consultation session retrieved successfully", data);
  } catch (error: any) {
    console.error("[/api/psikolog/konsultasi] error:", error);
    return errorResponse(500, error.message || "Failed to fetch consultation session");
  }
}
