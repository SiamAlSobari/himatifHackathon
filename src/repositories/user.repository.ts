import { db } from "@/lib/db";

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

    async updateUserProfile(id: string, data: { usia?: number; jenisKelamin?: string; kontakDarurat?: string | null; isOnboarded?: boolean }) {
        return await db.user.update({
            where: { id },
            data,
        });
    }
}

const userRepository = new UserRepository();
export default userRepository;
