import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import userRepository from "@/repositories/user.repository";
import screeningService from "@/services/screening.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const dbUser = await userRepository.getUserProfile(session.user.id);
    if (!dbUser) {
      return errorResponse(404, "User not found");
    }

    const hasScreenedToday = await screeningService.checkDailyScreeningStatus(session.user.id);

    return successResponse(200, "Dashboard data retrieved successfully", {
      user: {
        name: dbUser.name || dbUser.email || "Pengguna",
        image: dbUser.image,
        email: dbUser.email,
        usia: dbUser.usia,
        jenisKelamin: dbUser.jenisKelamin,
      },
      isOnboarded: dbUser.isOnboarded,
      hasScreenedToday,
    });
  } catch (error) {
    console.error("[/api/dashboard] error:", error);
    return errorResponse(500, "Failed to fetch dashboard data");
  }
}
