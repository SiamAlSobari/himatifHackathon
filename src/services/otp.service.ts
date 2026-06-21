import { formatToIndonesianNumber } from "@/lib/phone-helper";
import { otpStore, generateOtpCode } from "@/lib/otp-store";
import userRepository from "@/repositories/user.repository";

export class OtpService {
  async sendOtp(userId: string, rawPhone: string) {
    if (!rawPhone || rawPhone.trim() === "") {
      throw new Error("Nomor telepon tidak boleh kosong.");
    }

    const formattedPhone = formatToIndonesianNumber(rawPhone);
    const otpCode = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Save to global in-memory store
    otpStore.set(formattedPhone, {
      code: otpCode,
      expiresAt,
      userId,
    });
    // Call Fonnte API
    const fonnteToken = process.env.FONNTE_TOKEN;
    
    // If token is missing, log a warning and succeed (for testing/demo fallback)
    if (!fonnteToken || fonnteToken === "your_fonnte_token_here") {
      console.warn("[FONNTE] Token is not configured. Falling back to Mock SMS/WhatsApp. OTP Code:", otpCode);
      return {
        success: true,
        formattedPhone,
        mocked: true,
        code: otpCode,
      };
    }

    try {
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          Authorization: fonnteToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: formattedPhone,
          message: `Kode verifikasi Jembatan Aman Anda adalah: ${otpCode}. Kode ini berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.`,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.status) {
        throw new Error(resJson.reason || "Fonnte API returned failure status");
      }

      return {
        success: true,
        formattedPhone,
        mocked: false,
      };
    } catch (err: any) {
      console.error("[FONNTE ERROR]:", err);
      throw new Error(`Gagal mengirim kode verifikasi ke ${formattedPhone}: ${err.message || "Provider error"}`);
    }
  }

  async verifyOtp(userId: string, rawPhone: string, code: string) {
    if (!code || code.trim() === "") {
      throw new Error("Kode OTP tidak boleh kosong.");
    }

    const formattedPhone = formatToIndonesianNumber(rawPhone);
    const cachedOtp = otpStore.get(formattedPhone);

    if (!cachedOtp) {
      throw new Error("Kode OTP tidak ditemukan. Silakan kirim ulang kode.");
    }

    if (cachedOtp.userId !== userId) {
      throw new Error("Sesi verifikasi tidak cocok.");
    }

    if (new Date() > cachedOtp.expiresAt) {
      otpStore.delete(formattedPhone);
      throw new Error("Kode OTP telah kedaluwarsa. Silakan kirim ulang kode.");
    }

    if (cachedOtp.code !== code.trim()) {
      throw new Error("Kode OTP yang Anda masukkan salah.");
    }

    // Success: Update database
    await userRepository.updateUserProfile(userId, {
      kontakDarurat: formattedPhone,
    });

    // Clean up store
    otpStore.delete(formattedPhone);

    return {
      success: true,
    };
  }
}

const otpService = new OtpService();
export default otpService;
