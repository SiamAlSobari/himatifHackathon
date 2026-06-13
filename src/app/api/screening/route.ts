import { errorResponse, successResponse } from "@/lib/response";
import { ScreeningRequest } from "@/lib/types/screening";
import screeningService from "@/services/screening.service";

export async function POST(request: Request) {
    try {
        const { type, answers } = await request.json() as ScreeningRequest;
        const result = await screeningService.calculateScreeningScore({ type, answers });
        if (!result) {
            return errorResponse(500, "Failed to calculate screening");
        }

        return successResponse(200, "Screening calculated successfully", result);
    } catch (error) {
        console.error("Error in Screening route:", error);
        return errorResponse(500, "Failed to calculate screening");
    }
}