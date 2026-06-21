import { errorResponse, successResponse } from "@/lib/response";
import passwordService from "@/services/password.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, email, newPassword } = body;

    const result = await passwordService.resetPassword(token, email, newPassword);
    return successResponse(200, "Password berhasil di-reset", result);
  } catch (error: any) {
    console.error("[/api/auth/password/reset-confirm] error:", error);
    return errorResponse(400, error.message || "Gagal mereset password");
  }
}
