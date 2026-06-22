export type NotificationType = "UNREAD_CHAT" | "BOOKING_DOCTOR" | "APPOINTMENT_REMINDER";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string; // "UNREAD_CHAT" | "BOOKING_DOCTOR" | "APPOINTMENT_REMINDER"
  read: boolean;
  metaData?: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface GetNotificationsResponse {
  success: boolean;
  message: string;
  data: AppNotification[];
}
