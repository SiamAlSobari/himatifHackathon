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

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const body = await req.json();
    const { name, usia, jenisKelamin, kontakDarurat } = body;

    if (kontakDarurat !== undefined) {
      await profileService.updateUserPhoneNumber(session.user.id, kontakDarurat);
      return successResponse(200, "Nomor telepon berhasil diperbarui", null);
    }

    await profileService.updateUserProfile(session.user.id, { name, usia, jenisKelamin });
    return successResponse(200, "Profil berhasil diperbarui", null);
  } catch (error: any) {
    console.error("[/api/profile] POST error:", error);
    return errorResponse(500, error.message || "Failed to update profile data");
  }
}

