import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import notificationService from "@/services/notification.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const data = await notificationService.getUserNotifications(session.user.id);
    return successResponse(200, "Notifications retrieved successfully", data);
  } catch (error: any) {
    console.error("[/api/notifications] error:", error);
    return errorResponse(500, error.message || "Failed to fetch notifications");
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { type, message, title } = await request.json();
    const userId = session.user.id;

    let notification;
    if (type === "BOOKING_DOCTOR") {
      notification = await notificationService.createNotification(userId, {
        title: title || "Booking Dokter Sukses",
        message: message || "Dokter spesialis Anda telah mengonfirmasi booking konsultasi.",
        type,
        metaData: {
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          psychologistName: "Dr. Al Sobari, M.Psi."
        }
      });
    } else if (type === "APPOINTMENT_REMINDER") {
      notification = await notificationService.createNotification(userId, {
        title: title || "Konsultasi Mendekati Waktu",
        message: message || "Sesi konsultasi Anda akan dimulai dalam 15 menit. Silakan bersiap-siap.",
        type,
        metaData: {
          appointmentId: "simulated-appointment-id",
          minutesRemaining: 15
        }
      });
    } else if (type === "UNREAD_CHAT") {
      notification = await notificationService.createNotification(userId, {
        title: title || "Pesan Baru dari Psikolog",
        message: message || "Halo, bagaimana kabarmu hari ini? Kabari saya jika sudah siap memulai sesi.",
        type,
        metaData: {
          appointmentId: "simulated-appointment-id",
          sender: "psychologist",
          senderName: "Dr. Al Sobari, M.Psi."
        }
      });
    } else {
      notification = await notificationService.createNotification(userId, {
        title: title || "Notifikasi Baru",
        message: message || "Anda memiliki pembaruan baru di Verimind.",
        type: type || "GENERAL"
      });
    }

    return successResponse(201, "Notification simulated successfully", notification);
  } catch (error: any) {
    console.error("[/api/notifications] POST error:", error);
    return errorResponse(500, error.message || "Failed to simulate notification");
  }
}
