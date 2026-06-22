import notificationRepository from "@/repositories/notification.repository";
import { pusherServer } from "@/lib/pusher/pusher-server";

export class NotificationService {
    async getUserNotifications(userId: string) {
        return await notificationRepository.getUserNotifications(userId);
    }

    async getUnreadCount(userId: string) {
        return await notificationRepository.getUnreadCount(userId);
    }

    async createNotification(userId: string, data: { title: string; message: string; type: string; metaData?: any }) {
        const notification = await notificationRepository.createNotification(
            userId,
            data.title,
            data.message,
            data.type,
            data.metaData
        );

        // Send real-time notification via Pusher
        try {
            await pusherServer.trigger(`user-${userId}`, "notification-received", notification);
        } catch (error) {
            console.error("Failed to push real-time notification via Pusher:", error);
        }

        return notification;
    }

    async markAsRead(id: string) {
        return await notificationRepository.markAsRead(id);
    }

    async markAllAsRead(userId: string) {
        return await notificationRepository.markAllAsRead(userId);
    }
}

const notificationService = new NotificationService();
export default notificationService;
