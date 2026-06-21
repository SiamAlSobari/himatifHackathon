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
    const { phoneNumber, otpCode } = body;

    const result = await otpService.verifyOtp(session.user.id, phoneNumber, otpCode);
    return successResponse(200, "Nomor telepon berhasil diverifikasi dan diperbarui", result);
  } catch (error: any) {
    console.error("[/api/profile/otp/verify] error:", error);
    return errorResponse(400, error.message || "Gagal memverifikasi kode OTP");
  }
}
