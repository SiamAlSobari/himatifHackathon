import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistService from "@/services/psychologist.service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  const role = (session.user as any).role;
  if (role !== "PSYCHOLOGY") {
    return errorResponse(403, "Forbidden - Hanya psikolog yang dapat melakukan onboarding");
  }

  try {
    const formData = await request.formData();
    const specialty = formData.get("specialty") as string;
    const experienceYearsRaw = formData.get("experienceYears") as string;
    const tagsRaw = formData.get("tags") as string;
    const operationalHoursRaw = formData.get("operationalHours") as string;
    const imageFile = formData.get("imageFile") as File;

    if (!specialty || !experienceYearsRaw || !tagsRaw || !operationalHoursRaw) {
      return errorResponse(400, "Semua data onboarding wajib diisi");
    }

    const experienceYears = parseInt(experienceYearsRaw, 10);
    if (isNaN(experienceYears)) {
      return errorResponse(400, "Pengalaman tahun harus berupa angka");
    }

    let tags: string[] = [];
    try {
      tags = JSON.parse(tagsRaw);
    } catch (e) {
      tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
    }

    let operationalHours: string[] = [];
    try {
      operationalHours = JSON.parse(operationalHoursRaw);
    } catch (e) {
      operationalHours = operationalHoursRaw.split(",").map(t => t.trim()).filter(Boolean);
    }

    await psychologistService.onboardPsychologist(
      session.user.id,
      {
        specialty,
        experienceYears,
        tags,
        operationalHours,
      },
      imageFile && imageFile.size > 0 ? imageFile : null
    );

    return successResponse(200, "Onboarding berhasil diselesaikan", null);
  } catch (error: any) {
    console.error("Failed to complete onboarding:", error);
    return errorResponse(500, error.message || "Failed to complete onboarding");
  }
}
