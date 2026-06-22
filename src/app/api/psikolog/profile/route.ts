import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import psychologistProfileService from "@/services/psychologist-profile.service";
import type { UpdatePsychologistProfilePayload } from "@/lib/types/psychologist-profile";

async function requirePsychologistSession() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = (session.user as any).role;
  if (role !== "PSYCHOLOGY") return null;
  return session;
}

export async function GET() {
  const session = await requirePsychologistSession();
  if (!session || !session.user) return errorResponse(401, "Unauthorized");

  try {
    const data = await psychologistProfileService.getPsychologistProfileData(session.user.id!);
    return successResponse(200, "Psychologist profile data retrieved", data);
  } catch (error: any) {
    console.error("[/api/psikolog/profile GET]", error);
    return errorResponse(500, error.message || "Failed to fetch profile");
  }
}

export async function POST(req: Request) {
  const session = await requirePsychologistSession();
  if (!session || !session.user) return errorResponse(401, "Unauthorized");

  try {
    const body = await req.json();

    // Phone-number-only update (OTP-verified path reuses the same endpoint)
    if (body.kontakDarurat !== undefined) {
      await psychologistProfileService.updateContactNumber(session.user.id!, body.kontakDarurat);
      return successResponse(200, "Nomor telepon berhasil diperbarui", null);
    }

    const payload: UpdatePsychologistProfilePayload = {
      name: body.name,
      roleTitle: body.roleTitle,
      specialty: body.specialty,
      experienceYears: body.experienceYears !== undefined ? Number(body.experienceYears) : undefined,
    };

    await psychologistProfileService.updatePsychologistProfile(session.user.id!, payload);
    return successResponse(200, "Profil berhasil diperbarui", null);
  } catch (error: any) {
    console.error("[/api/psikolog/profile POST]", error);
    return errorResponse(500, error.message || "Failed to update profile");
  }
}
