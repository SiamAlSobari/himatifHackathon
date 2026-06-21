import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import passwordService from "@/services/password.service";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    const result = await passwordService.updatePassword(session.user.id, currentPassword, newPassword);
    return successResponse(200, "Password berhasil diperbarui", result);
  } catch (error: any) {
    console.error("[/api/profile/password/update] error:", error);
    return errorResponse(400, error.message || "Gagal memperbarui password");
  }
}
