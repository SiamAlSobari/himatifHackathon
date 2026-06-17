import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  const role = (session.user as any).role;
  if (role !== "PSYCHOLOGY") {
    return errorResponse(403, "Forbidden - Hanya psikolog yang dapat mengakses halaman ini");
  }

  try {
    const data = await psychologistService.getPsychologistDashboardData(session.user.id);
    return successResponse(200, "Psychologist dashboard data retrieved successfully", data);
  } catch (error: any) {
    console.error("[/api/psikolog/dashboard] error:", error);
    return errorResponse(500, error.message || "Failed to fetch psychologist dashboard data");
  }
}
