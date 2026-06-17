import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import psychologistService from "@/services/psychologist.service";
import { errorResponse, successResponse } from "@/lib/response";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const roleTitle = formData.get("roleTitle") as string;
    const specialty = formData.get("specialty") as string;
    const experienceYearsRaw = formData.get("experienceYears") as string;
    const imageFile = formData.get("imageFile") as File;
    const tagsRaw = formData.get("tags") as string;

    if (!email || !password || !name || !roleTitle || !specialty || !experienceYearsRaw) {
      return errorResponse(400, "Semua data profil wajib diisi");
    }

    if (password.length < 6) {
      return errorResponse(400, "Password minimal 6 karakter");
    }

    const experienceYears = parseInt(experienceYearsRaw, 10);
    if (isNaN(experienceYears)) {
      return errorResponse(400, "Pengalaman tahun harus berupa angka");
    }

    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const passwordHash = await bcrypt.hash(password, 12);

    await psychologistService.registerPsychologist({
      email,
      passwordHash,
      name,
      roleTitle,
      specialty,
      experienceYears,
      tags,
    }, imageFile && imageFile.size > 0 ? imageFile : null);

    return successResponse(201, "Mitra berhasil didaftarkan", { email });
  } catch (error: any) {
    console.error("Failed to register psychologist:", error);
    return errorResponse(500, error.message || "Failed to register psychologist");
  }
}
