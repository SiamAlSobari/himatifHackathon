"use client";

import { Camera, Share2 } from "lucide-react";
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
    location || null,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Image
            src={avatarUrl || "https://i.pravatar.cc/160?img=47"}
            alt={name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover"
          />
          <button
            type="button"
            aria-label="Ubah foto profil"
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-600 text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-4 text-base font-semibold text-slate-800">
          {name}
        </h2>
        {subtitleParts.length > 0 && (
          <p className="mt-1 text-sm text-slate-400">
            {subtitleParts.join(" • ")}
          </p>
        )}

        <div className="mt-5 flex w-full items-center gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl bg-teal-800 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-900"
          >
            Edit Profil
          </button>
          <button
            type="button"
            aria-label="Bagikan profil"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:border-teal-200 hover:text-teal-700"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}