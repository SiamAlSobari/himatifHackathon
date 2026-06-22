import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import notificationService from "@/services/notification.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return errorResponse(400, "Missing notification id");
    }

    const updated = await notificationService.markAsRead(id);
    return successResponse(200, "Notification marked as read successfully", updated);
  } catch (error: any) {
    console.error("[/api/notifications/read] error:", error);
    return errorResponse(500, error.message || "Failed to mark notification as read");
  }
}
