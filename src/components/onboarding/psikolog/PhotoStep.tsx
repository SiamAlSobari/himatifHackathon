"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Camera, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getCroppedImg } from "@/lib/helpers/crop";

interface PhotoStepProps {
  croppedPreviewUrl: string | null;
  onPhotoCropped: (blob: Blob, previewUrl: string) => void;
  styles: any;
}

export default function PhotoStep({
  croppedPreviewUrl,
  onPhotoCropped,
  styles,
}: PhotoStepProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        if (croppedBlob) {
          const croppedUrl = URL.createObjectURL(croppedBlob);
          onPhotoCropped(croppedBlob, croppedUrl);
          setCropperOpen(false);
          toast.success("Foto profil berhasil dipotong!");
        }
      } catch (e) {
        console.error(e);
        toast.error("Gagal memotong gambar.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-[#2D3748]/60 leading-relaxed font-semibold">
        Pilih foto wajah resmi Anda dengan pencahayaan yang cukup. Foto ini akan menjadi identitas Anda yang tampil pada modul booking konsultasi pengguna.
      </p>

      <div className="flex flex-col items-center justify-center gap-5 py-8 bg-slate-50/50 rounded-3xl border border-dashed border-[#2D3748]/10 hover:bg-slate-50 transition-all duration-300">
        <div className="relative group">
          <img
            src={croppedPreviewUrl || "https://res.cloudinary.com/dbxrtg9px/image/upload/v1710000000/default-avatar.png"}
            alt="Preview Foto Profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl shadow-black/5 group-hover:scale-105 transition-transform duration-300"
          />
          <label
            htmlFor="profile-upload"
            className="absolute bottom-0 right-0 h-9 w-9 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors group-hover:scale-110 duration-300"
          >
            <Camera className="h-4 w-4" />
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
          />
        </div>

        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-[#0D1B2A]">Pilih Berkas Foto Anda</p>
          <p className="text-[10px] text-[#2D3748]/40 font-medium">Format file: JPG, JPEG, PNG, atau WEBP.</p>
        </div>
      </div>

      <div className="bg-amber-50/70 border border-amber-100/80 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
          Setelah memilih foto, alat pemotong gambar premium (aspect ratio 1:1) akan muncul otomatis untuk membantu menengahkan foto wajah Anda.
        </p>
      </div>

      {/* Premium Image Cropper Modal */}
      {cropperOpen && imageSrc && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-800">Sesuaikan Ukuran Foto</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Seret dan perbesar untuk memposisikan foto wajah Anda.</p>
              </div>
              <button
                onClick={() => setCropperOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative h-64 sm:h-80 bg-slate-900">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Cropper Controls & Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-150">
              <div className="mb-4">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1.5">
                  <span>ZOOM</span>
                  <span>{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-label="Zoom"
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCropperOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 bg-white rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Simpan & Potong
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
