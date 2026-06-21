import { errorResponse, successResponse } from "@/lib/response";
import passwordService from "@/services/password.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    
    // Get host origin from request headers or request URL
    const origin = req.headers.get("origin") || new URL(req.url).origin;

    const result = await passwordService.sendPasswordResetLink(email, origin);
    return successResponse(200, "Link reset password berhasil dibuat", result);
  } catch (error: any) {
    console.error("[/api/auth/password/reset-request] error:", error);
    return errorResponse(400, error.message || "Gagal membuat link reset password");
  }
}
