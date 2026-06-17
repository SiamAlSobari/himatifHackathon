import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import userService from "@/services/user.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const data = await userService.getUserDashboardData(session.user.id);
    return successResponse(200, "Dashboard data retrieved successfully", data);
  } catch (error: any) {
    console.error("[/api/dashboard] error:", error);
    return errorResponse(500, error.message || "Failed to fetch dashboard data");
  }
}
