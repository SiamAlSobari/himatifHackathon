import { db } from "@/lib/db";

class NotificationRepository {
    async getUserNotifications(userId: string) {
        return await db.notification.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async getUnreadCount(userId: string) {
        return await db.notification.count({
            where: {
                userId,
                read: false,
            },
        });
    }

    async createNotification(userId: string, title: string, message: string, type: string, metaData?: any) {
        return await db.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                metaData: metaData || undefined,
            },
        });
    }

    async markAsRead(id: string) {
        return await db.notification.update({
            where: { id },
            data: { read: true },
        });
    }

    async markAllAsRead(userId: string) {
        return await db.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: { read: true },
        });
    }
}

const notificationRepository = new NotificationRepository();
export default notificationRepository;
