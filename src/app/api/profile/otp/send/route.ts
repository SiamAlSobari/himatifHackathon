import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import otpService from "@/services/otp.service";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const body = await req.json();
    const { phoneNumber } = body;

    const result = await otpService.sendOtp(session.user.id, phoneNumber);
    return successResponse(200, "Kode verifikasi berhasil dikirim", result);
  } catch (error: any) {
    console.error("[/api/profile/otp/send] error:", error);
    return errorResponse(500, error.message || "Gagal mengirim kode verifikasi");
  }
}
