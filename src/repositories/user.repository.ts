import { db } from "@/lib/db";
import { UserRole } from "../../generated/prisma/enums";

class UserRepository {
    async getUserProfile(id: string) {
        return await db.user.findUnique({
            where: { id },
            select: { name: true, image: true, email: true, usia: true, jenisKelamin: true, isOnboarded: true },
        });
    }

    async getUserById(id: string) {
        return await db.user.findUnique({
            where: { id },
        });
    }

    async getUserByEmail(email: string) {
        return await db.user.findUnique({
            where: { email },
        });
    }

    async createUser(data: { email: string; passwordHash: string; name: string; role: UserRole; isOnboarded: boolean; image?: string }) {
        return await db.user.create({
            data,
        });
    }

    async updateUserProfile(id: string, data: { name?: string; image?: string; usia?: number; jenisKelamin?: string; kontakDarurat?: string | null; isOnboarded?: boolean }) {
        return await db.user.update({
            where: { id },
            data,
        });
    }
}

const userRepository = new UserRepository();
export default userRepository;

