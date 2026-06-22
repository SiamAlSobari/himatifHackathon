"use client";

import Image from "next/image";
import { Camera, Star, Award, Briefcase } from "lucide-react";
import type { PsychologistProfileDetails, PsychologistProfileUser } from "@/lib/types/psychologist-profile";

interface PsychologistProfileCardProps {
  user: PsychologistProfileUser;
  profile: PsychologistProfileDetails;
  onEdit: () => void;
}

export default function PsychologistProfileCard({ user, profile, onEdit }: PsychologistProfileCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 rounded-full bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Image
            src={profile.imageUrl || user.image || "https://i.pravatar.cc/160?img=12"}
            alt={user.name}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full object-cover border-2 border-slate-100 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-teal-700 text-white shadow-sm">
            <Camera className="h-4 w-4" />
          </div>
        </div>

        {/* Name & Role badge */}
        <h2 className="mt-4 text-base font-bold text-slate-800">{user.name}</h2>
        <span className="mt-1 inline-block rounded-full bg-teal-50 px-3 py-0.5 text-xs font-bold text-teal-700 border border-teal-100">
          {profile.role}
        </span>

        {/* Quick stats row */}
        <div className="mt-4 grid grid-cols-3 gap-2 w-full">
          <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="text-sm font-black text-slate-800">{profile.rating.toFixed(1)}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Rating</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center gap-0.5">
              <Award className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-sm font-black text-slate-800">{profile.experienceYears}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Thn. Exp</p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-slate-50 p-2.5">
            <div className="flex items-center gap-0.5">
              <Briefcase className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-[10px] font-black text-slate-800">{profile.availability === "AVAILABLE" ? "Aktif" : "Sibuk"}</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Status</p>
          </div>
        </div>

        {/* Edit button */}
        <button
          type="button"
          onClick={onEdit}
          className="mt-4 w-full rounded-xl bg-[#0D1B2A] py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-[#1A8A7A] hover:shadow-sm cursor-pointer"
        >
          Edit Profil
        </button>
      </div>
    </div>
  );
}
