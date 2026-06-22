import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import notificationService from "@/services/notification.service";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const updated = await notificationService.markAllAsRead(session.user.id);
    return successResponse(200, "All notifications marked as read successfully", updated);
  } catch (error: any) {
    console.error("[/api/notifications/read-all] error:", error);
    return errorResponse(500, error.message || "Failed to mark all notifications as read");
  }
}
