"use client";

import { User, Phone, Mail, Briefcase, Clock, Tag, Award } from "lucide-react";
import type { PsychologistProfileDetails, PsychologistProfileUser } from "@/lib/types/psychologist-profile";

interface PsychologistPersonalInfoCardProps {
  user: PsychologistProfileUser;
  profile: PsychologistProfileDetails;
  onEditPhone: () => void;
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        {icon}
        {label}
      </label>
      <input
        type="text"
        value={value || "—"}
        disabled
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
      />
    </div>
  );
}

export default function PsychologistPersonalInfoCard({
  user,
  profile,
  onEditPhone,
}: PsychologistPersonalInfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center gap-2">
        <User className="h-4 w-4 text-slate-400" />
        <h2 className="text-base font-bold text-slate-800">Informasi Profil</h2>
      </div>

      <div className="flex flex-col gap-4">
        <InfoRow
          icon={<User className="h-3.5 w-3.5 text-slate-400" />}
          label="Nama Lengkap"
          value={user.name}
        />
        <InfoRow
          icon={<Mail className="h-3.5 w-3.5 text-slate-400" />}
          label="Email"
          value={user.email}
        />
        <InfoRow
          icon={<Briefcase className="h-3.5 w-3.5 text-slate-400" />}
          label="Spesialisasi / Fokus Bidang"
          value={profile.specialty}
        />
        <InfoRow
          icon={<Award className="h-3.5 w-3.5 text-slate-400" />}
          label="Pengalaman"
          value={`${profile.experienceYears} Tahun`}
        />

        {/* Phone with OTP trigger */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={user.kontakDarurat || ""}
            placeholder="Belum ada nomor telepon"
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-500 placeholder:text-slate-300 cursor-not-allowed outline-none"
          />
          <button
            type="button"
            onClick={onEditPhone}
            className="mt-2 text-xs font-bold text-teal-700 hover:underline hover:opacity-85 cursor-pointer text-left inline-block"
          >
            {user.kontakDarurat ? "Ubah nomor telepon?" : "Tambah nomor telepon?"}
          </button>
        </div>

        {/* Tags */}
        {profile.tags.length > 0 && (
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              Tag Keahlian
            </label>
            <div className="flex flex-wrap gap-1.5">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Operational hours */}
        {profile.operationalHours.length > 0 && (
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              Jam Operasional Praktek
            </label>
            <div className="flex flex-wrap gap-1.5">
              {profile.operationalHours.map((h) => (
                <span
                  key={h}
                  className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                >
                  {h} WIB
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
