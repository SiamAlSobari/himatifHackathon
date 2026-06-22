"use client";

import React from "react";
import { Clock, Star, Award, MapPin } from "lucide-react";

interface PreviewConfirmStepProps {
  userName: string;
  roleTitle: string;
  croppedPreviewUrl: string | null;
  focusArea: string;
  experienceYears: string;
  selectedTags: string[];
  selectedHours: string[];
  styles: any;
}

export default function PreviewConfirmStep({
  userName,
  roleTitle,
  croppedPreviewUrl,
  focusArea,
  experienceYears,
  selectedTags,
  selectedHours,
  styles,
}: PreviewConfirmStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-xs text-[#2D3748]/60 leading-normal font-semibold">
        Tinjau kembali tampilan kartu profil Anda. Informasi ini akan dipajang langsung di halaman pemesanan bagi para pengguna Verimind.
      </p>

      {/* Doctor Card Mockup (matching app aesthetics) */}
      <div className="border border-slate-150 rounded-3xl p-5 bg-gradient-to-b from-white to-slate-50/50 shadow-md relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />

        <div className="flex gap-4">
          <img
            src={croppedPreviewUrl || "https://res.cloudinary.com/dbxrtg9px/image/upload/v1710000000/default-avatar.png"}
            alt={userName}
            className="w-20 h-20 rounded-2xl object-cover border border-[#2D3748]/10 shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider inline-block ${styles.badge}`}>
              {roleTitle || "Mitra Spesialis"}
            </span>
            <h4 className="font-serif font-black text-base text-[#0D1B2A] leading-tight">
              {userName}
            </h4>
            <p className="text-xs text-[#1A8A7A] font-bold leading-normal">
              {focusArea || "Fokus Bidang belum dipilih"}
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-[#2D3748]/50 font-bold">
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>5.0 ★ (Baru)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Award className="h-3 w-3" />
                <span>{experienceYears || "0"} Tahun Pengalaman</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {selectedTags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dashed border-[#2D3748]/10 flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white border border-[#2D3748]/10 text-[#2D3748]/60 text-[10px] rounded-full font-bold shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Available Hours */}
        {selectedHours.length > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-[#2D3748]/10">
            <div className="flex items-center gap-1.5 text-[10px] text-[#0D1B2A] font-extrabold uppercase mb-2">
              <Clock className="h-3.5 w-3.5 text-[#1A8A7A]" />
              <span>Jam Operasional Praktek Tersedia:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedHours.map((hour) => (
                <span
                  key={hour}
                  className="px-2.5 py-1 rounded-lg text-[9px] font-extrabold bg-[#0D1B2A]/5 text-[#0D1B2A] border border-[#0D1B2A]/10 shadow-sm"
                >
                  {hour} WIB
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
        <p className="text-[10px] text-teal-800 leading-normal font-semibold">
          💡 Tips: Anda dapat kembali ke langkah sebelumnya untuk mengubah data sebelum menekan tombol "Simpan & Selesaikan" di bawah.
        </p>
      </div>
    </div>
  );
}
