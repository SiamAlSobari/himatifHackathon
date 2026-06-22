import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import psychologistService from "@/services/psychologist.service";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const { email, password, name, roleTitle } = await request.json();

    if (!email || !password || !name || !roleTitle) {
      return errorResponse(400, "Email, password, nama, dan spesialisasi role wajib diisi");
    }

    if (password.length < 6) {
      return errorResponse(400, "Password minimal 6 karakter");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await psychologistService.registerPsychologist({
      email,
      passwordHash,
      name,
      roleTitle,
    });

    return successResponse(201, "Mitra berhasil didaftarkan", { email });
  } catch (error: any) {
    console.error("Failed to register psychologist:", error);
    return errorResponse(500, error.message || "Failed to register psychologist");
  }
}
