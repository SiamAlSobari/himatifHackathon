interface OtpData {
  code: string;
  expiresAt: Date;
  userId: string;
}

// Global caching pattern to prevent map reset on Next.js hot-reloads
const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, OtpData>;
};

export const otpStore = globalForOtp.otpStore || new Map<string, OtpData>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.otpStore = otpStore;
}

/**
 * Generate a random 6-digit numeric OTP code
 */
export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
