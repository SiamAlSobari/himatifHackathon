import { auth } from "@/auth";
import { errorResponse, successResponse } from "@/lib/response";
import { uploadToCloudinary } from "@/lib/cloudinary";
import userRepository from "@/repositories/user.repository";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return errorResponse(401, "Unauthorized");
  }

  try {
    const formData = await request.formData();
    const imageFile = formData.get("imageFile") as File;

    if (!imageFile || imageFile.size === 0) {
      return errorResponse(400, "Berkas gambar tidak boleh kosong");
    }

    // Upload to Cloudinary under the users folder
    const imageUrl = await uploadToCloudinary(imageFile, "users");

    // Save to user profile database record
    await userRepository.updateUserProfile(session.user.id, {
      image: imageUrl
    });

    return successResponse(200, "Foto profil berhasil diperbarui", { imageUrl });
  } catch (error: any) {
    console.error("Failed to upload avatar:", error);
    return errorResponse(500, error.message || "Gagal mengunggah foto profil");
  }
}
