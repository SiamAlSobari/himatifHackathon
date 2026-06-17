import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import userService from "@/services/user.service";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const destination = await userService.resolveLoginDestination(session.user.id);
    return successResponse(200, "Destination resolved", { destination });
  } catch (error) {
    console.error("[/api/auth/destination] error:", error);
    return successResponse(200, "Fallback to dashboard", { destination: "/dashboard" });
  }
}
