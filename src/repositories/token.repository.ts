import { db } from "@/lib/db";

class TokenRepository {
  async createResetToken(email: string, token: string, expires: Date) {
    return await db.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });
  }

  async findResetToken(token: string) {
    return await db.verificationToken.findUnique({
      where: { token },
    });
  }

  async deleteResetToken(token: string) {
    try {
      return await db.verificationToken.delete({
        where: { token },
      });
    } catch {
      // In case token was already deleted or doesn't exist
      return null;
    }
  }

  async deleteExistingResetTokens(email: string) {
    try {
      return await db.verificationToken.deleteMany({
        where: {
          identifier: email,
        },
      });
    } catch {
      return null;
    }
  }
}

const tokenRepository = new TokenRepository();
export default tokenRepository;
