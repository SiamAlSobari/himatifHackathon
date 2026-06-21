import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { ScreeningRequest } from "@/lib/types/screening";
import screeningService from "@/services/screening.service";
import { db } from "@/lib/db";

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return errorResponse(401, "Unauthorized");
    }

    try {
        const { type, answers } = await request.json() as ScreeningRequest;
        const screeningResult = await screeningService.calculateScreeningScore({ type, answers });
        if (!screeningResult) {
            return errorResponse(500, "Failed to calculate screening");
        }

        const savedResult = await screeningService.saveScreeningResult(session.user.id, screeningResult);
        if (!savedResult) {
            return errorResponse(500, "Failed to save screening result");
        }

        if (type === "ONBOARDING") {
            await db.user.update({
                where: { id: session.user.id },
                data: { isOnboarded: true },
            });
        }

        return successResponse(200, "Screening calculated successfully", savedResult);
    } catch (error) {
        console.error("Error in Screening route:", error);
        return errorResponse(500, "Failed to calculate screening");
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return errorResponse(401, "Unauthorized");
    }

    try {
        const history = await screeningService.getScreeningHistory(session.user.id);
        return successResponse(200, "Screening history retrieved successfully", history);
    } catch (error) {
        console.error("Error in GET /api/screening:", error);
        return errorResponse(500, "Failed to retrieve screening history");
    }
}