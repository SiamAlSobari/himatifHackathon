import crypto from "crypto";
import bcrypt from "bcrypt";
import userRepository from "@/repositories/user.repository";
import tokenRepository from "@/repositories/token.repository";

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

    console.log(`[PASSWORD RESET DEBUG] Link generated for ${trimmedEmail}: ${resetLink}`);

    // Since we don't have a real email provider integrated for the MVP, 
    // we log the link and send it in the API response (mock mode) so that it can be easily copied and tested.
    return {
      success: true,
      mocked: true,
      resetLink,
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
