import crypto from "crypto";
import bcrypt from "bcrypt";
import userRepository from "@/repositories/user.repository";
import tokenRepository from "@/repositories/token.repository";
import { sendEmail } from "@/lib/email";

export class PasswordService {
  async updatePassword(userId: string, currentPass: string, newPass: string) {
    if (!currentPass || !newPass) {
      throw new Error("Password saat ini dan password baru wajib diisi.");
    }
    if (newPass.length < 6) {
      throw new Error("Password baru minimal harus 6 karakter.");
    }

    const user = await userRepository.getUserById(userId);
    if (!user) {
      throw new Error("User tidak ditemukan.");
    }

    // Handle case where user registered with OAuth and has no password hash
    if (!user.passwordHash) {
      throw new Error(
        "Akun Anda terdaftar melalui Google Sign-In. Silakan gunakan fitur 'Lupa Password' untuk mengatur kata sandi pertama kali."
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) {
      throw new Error("Password saat ini yang Anda masukkan salah.");
    }

    // Hash and save new password
    const newHash = await bcrypt.hash(newPass, 12);
    await userRepository.updateUserPassword(userId, newHash);

    return { success: true };
  }

  async sendPasswordResetLink(email: string, origin: string) {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      throw new Error("Alamat email wajib diisi.");
    }

    const user = await userRepository.getUserByEmail(trimmedEmail);
    if (!user) {
      throw new Error("Alamat email tidak terdaftar dalam sistem kami.");
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Clean old tokens for this email and save new one
    await tokenRepository.deleteExistingResetTokens(trimmedEmail);
    await tokenRepository.createResetToken(trimmedEmail, token, expires);

    const resetLink = `${origin}/reset-password?token=${token}&email=${encodeURIComponent(trimmedEmail)}`;

    // Build email templates
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #004349; text-align: center; font-family: 'Sora', sans-serif;">Atur Ulang Kata Sandi</h2>
        <p style="color: #2d3748; font-size: 14px; line-height: 1.6;">Halo ${user.name || "Pengguna Verimind"},</p>
        <p style="color: #2d3748; font-size: 14px; line-height: 1.6;">Kami menerima permintaan untuk mengatur ulang kata sandi akun Verimind Anda. Silakan klik tombol di bawah ini untuk melanjutkan:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #004349; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">Atur Ulang Sandi</a>
        </div>
        <p style="color: #4a5568; font-size: 13px; line-height: 1.6;">Tautan ini hanya berlaku selama 1 jam. Jika Anda tidak meminta pengaturan ulang ini, silakan abaikan email ini dengan aman.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
        <p style="font-size: 11px; color: #a0aec0; line-height: 1.5; word-break: break-all;">Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:<br /><a href="${resetLink}" style="color: #004349; text-decoration: underline;">${resetLink}</a></p>
      </div>
    `;

    const textBody = `Halo, silakan atur ulang kata sandi Anda dengan mengunjungi link berikut: ${resetLink}`;

    // Send email using Nodemailer helper
    const emailResult = await sendEmail({
      to: trimmedEmail,
      subject: "Atur Ulang Kata Sandi — Verimind",
      html: htmlBody,
      text: textBody,
    });

    console.log(`[PASSWORD RESET] Email dispatch result. Mocked: ${emailResult.mocked}`);

    return {
      success: true,
      mocked: emailResult.mocked,
      resetLink, // Still return link for demo simulation page box
    };
  }

  async resetPassword(token: string, email: string, newPass: string) {
    if (!token || !email || !newPass) {
      throw new Error("Parameter reset password tidak lengkap.");
    }
    if (newPass.length < 6) {
      throw new Error("Password baru minimal harus 6 karakter.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const tokenRecord = await tokenRepository.findResetToken(token);

    if (!tokenRecord) {
      throw new Error("Link reset password tidak valid atau sudah pernah digunakan.");
    }

    if (new Date() > tokenRecord.expires) {
      await tokenRepository.deleteResetToken(token);
      throw new Error("Link reset password telah kedaluwarsa. Silakan ajukan ulang.");
    }

    if (tokenRecord.identifier.toLowerCase() !== cleanEmail) {
      throw new Error("Identitas sesi reset tidak cocok.");
    }

    // Get user by email
    const user = await userRepository.getUserByEmail(cleanEmail);
    if (!user) {
      throw new Error("User tidak ditemukan.");
    }

    // Hash and update password
    const hashedPass = await bcrypt.hash(newPass, 12);
    await userRepository.updateUserPassword(user.id, hashedPass);

    // Remove token
    await tokenRepository.deleteResetToken(token);

    return { success: true };
  }
}

const passwordService = new PasswordService();
export default passwordService;
