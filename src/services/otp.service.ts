import { formatToIndonesianNumber } from "@/lib/phone-helper";
import { otpStore, generateOtpCode } from "@/lib/otp-store";
import userRepository from "@/repositories/user.repository";
import { sendWhatsApp } from "@/lib/fonnte";

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

    console.log(`[OTP DEBUG] Sent OTP ${otpCode} to ${formattedPhone} for user ${userId}`);

    // Call Fonnte WhatsApp helper
    const message = `Kode verifikasi Jembatan Aman Anda adalah: ${otpCode}. Kode ini berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.`;
    const result = await sendWhatsApp(formattedPhone, message);

    return {
      success: true,
      formattedPhone,
      mocked: result.mocked,
      code: result.code, // Returned code if in mock mode for E2E testing ease
    };
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
