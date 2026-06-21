"use client";

import { Camera, Share2, MapPin } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  name: string;
  age?: number | null;
  location?: string | null;
  avatarUrl?: string | null;
}

export default function ProfileCard({
  name,
  age,
  location,
  avatarUrl,
}: ProfileCardProps) {
  const subtitleParts = [
    age ? `${age} Tahun` : null,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col items-center text-center">
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          <Image
            src={avatarUrl || "https://i.pravatar.cc/160?img=47"}
            alt={name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover border-2 border-slate-100 transition-transform duration-500 group-hover:scale-105"
          />
          <button
            type="button"
            aria-label="Ubah foto profil"
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-4 text-base font-bold text-slate-800 transition-colors duration-300">
          {name}
        </h2>
        
        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
          {subtitleParts.length > 0 && <span>{subtitleParts.join(" • ")}</span>}
          {subtitleParts.length > 0 && <span className="text-slate-300">•</span>}
          <div className="flex items-center gap-0.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span>{location || "Indonesia"}</span>
          </div>
        </div>

        <div className="mt-5 flex w-full items-center gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-sm active:scale-98"
          >
            Edit Profil
          </button>
          <button
            type="button"
            aria-label="Bagikan profil"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all duration-300 hover:border-primary/50 hover:text-primary active:scale-95"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}