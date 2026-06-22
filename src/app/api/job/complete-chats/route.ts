import { NextResponse } from "next/server";
import cronJobService from "@/services/cron-job.service";
import { errorResponse, successResponse } from "@/lib/response";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 1. Vercel Cron authentication (only active in production environment)
    if (process.env.NODE_ENV === "production") {
      const authHeader = req.headers.get("authorization");
      const cronSecret = process.env.CRON_SECRET;

      if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return errorResponse(401, "Unauthorized: Invalid authorization header");
      }
    }

    // 2. Run the stale chat sessions auto-closure & blockchain synchronization
    const result = await cronJobService.closeAndSyncStaleChatSessions();

    if (!result.success) {
      return errorResponse(500, result.message);
    }

    return successResponse(200, result.message, result);
  } catch (err: any) {
    console.error("[/api/job GET]", err);
    return errorResponse(500, err.message || "An unexpected error occurred during the job.");
  }
}
