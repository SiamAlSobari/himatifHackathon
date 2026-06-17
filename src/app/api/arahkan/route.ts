import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { seedPsychologists } from "@/lib/seed";
import userRepository from "@/repositories/user.repository";
import psychologistService from "@/services/psychologist.service";
import screeningService from "@/services/screening.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    // Ensure psychologists are seeded in database
    await seedPsychologists();

    const dbUser = await userRepository.getUserProfile(session.user.id);
    if (!dbUser) {
      return errorResponse(404, "User not found");
    }

    const hasScreenedToday = await screeningService.checkDailyScreeningStatus(session.user.id);
    const psychologists = await psychologistService.getPsychologists();
    const activeAppointment = await psychologistService.getActiveAppointment(session.user.id);
    const latestScreening = await psychologistService.getLatestScreening(session.user.id);

    return successResponse(200, "Arahkan data retrieved successfully", {
      dbUser: {
        id: session.user.id,
        name: dbUser.name || dbUser.email || "Pengguna",
        image: dbUser.image,
        usia: dbUser.usia,
        jenisKelamin: dbUser.jenisKelamin,
      },
      psychologists: psychologists.map((p) => ({
        id: p.id,
        name: p.user.name || "Psikolog",
        role: p.role,
        specialty: p.specialty,
        rating: p.rating,
        experienceYears: p.experienceYears,
        imageUrl: p.imageUrl,
        availability: p.availability,
        busyUntil: p.busyUntil || undefined,
        tags: p.tags,
      })),
      activeAppointment: activeAppointment ? {
        id: activeAppointment.id,
        scheduledAt: activeAppointment.scheduledAt.toISOString(),
        psychologist: {
          id: activeAppointment.psychologistProfile.id,
          name: activeAppointment.psychologistProfile.user.name || "Psikolog",
          role: activeAppointment.psychologistProfile.role,
          imageUrl: activeAppointment.psychologistProfile.imageUrl,
        }
      } : null,
      latestScreeningScore: latestScreening?.score || null,
      isOnboarded: dbUser.isOnboarded,
      hasScreenedToday,
    });
  } catch (error) {
    console.error("[/api/arahkan] error:", error);
    return errorResponse(500, "Failed to fetch arahkan data");
  }
}
