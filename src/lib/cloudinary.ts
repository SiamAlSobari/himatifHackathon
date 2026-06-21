import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(file: File, folder: string = "psychologists"): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: `verimind/${folder}` },
      (error, result) => {
        if (error) {
          reject(new Error("Cloudinary upload failed: " + error.message));
        } else {
          resolve(result?.secure_url || "");
        }
      }
    ).end(buffer);
  });
}

export default cloudinary;
