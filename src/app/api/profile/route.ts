import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import profileService from "@/services/profile.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const profileData = await profileService.getProfileData(session.user.id);
    return successResponse(200, "Profile data retrieved successfully", profileData);
  } catch (error: any) {
    console.error("[/api/profile] error:", error);
    return errorResponse(500, error.message || "Failed to fetch profile data");
  }
}
