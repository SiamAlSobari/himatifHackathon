import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const { psychologistId, rating } = await request.json();

    if (!psychologistId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return errorResponse(400, "Missing or invalid required fields (rating must be between 1 and 5)");
    }

    const updatedPsychologist = await psychologistService.ratePsychologist(psychologistId, rating);
    return successResponse(200, "Rating submitted successfully", updatedPsychologist);
  } catch (error) {
    console.error("Error in POST /api/psychologist/rate:", error);
    return errorResponse(
      500,
      "Internal Server Error: " + (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
