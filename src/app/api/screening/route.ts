import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { ScreeningRequest } from "@/lib/types/screening";
import screeningService from "@/services/screening.service";

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

        return successResponse(200, "Screening calculated successfully", savedResult);
    } catch (error) {
        console.error("Error in Screening route:", error);
        return errorResponse(500, "Failed to calculate screening");
    }
}