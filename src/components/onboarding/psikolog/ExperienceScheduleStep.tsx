"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Award, Clock } from "lucide-react";
import { TIME_SLOTS } from "@/lib/types/psychologist-onboarding";

interface ExperienceScheduleStepProps {
  experienceYears: string;
  setExperienceYears: (years: string) => void;
  selectedHours: string[];
  toggleHour: (hour: string) => void;
  styles: any;
}

export default function ExperienceScheduleStep({
  experienceYears,
  setExperienceYears,
  selectedHours,
  toggleHour,
  styles,
}: ExperienceScheduleStepProps) {
  return (
    <div className="space-y-6">
      {/* Experience Years */}
      <div className="space-y-2">
        <Label htmlFor="experienceYears" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1 block">
          Lama Pengalaman Kerja (Tahun)
        </Label>
        <div className="relative max-w-[200px]">
          <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D3748]/40" />
          <Input
            id="experienceYears"
            type="number"
            placeholder="Contoh: 5"
            min="0"
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            required
            className="h-10 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
          />
        </div>
      </div>

      {/* Operational hours */}
      <div className="pt-4 border-t border-[#2D3748]/5 space-y-3">
        <div className="space-y-1 ml-1">
          <Label className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase block">
            Pilih Jam Operasional Praktek
          </Label>
          <p className="text-[10px] text-[#2D3748]/40 font-medium">
            Klien hanya dapat memesan sesi konsultasi pada jam operasional aktif yang Anda pilih di bawah.
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map((hour) => {
            const isSelected = selectedHours.includes(hour);
            return (
              <button
                key={hour}
                type="button"
                onClick={() => toggleHour(hour)}
                className={`py-2.5 px-2 text-center rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isSelected
                    ? "bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white border-transparent shadow-md shadow-[#0D1B2A]/10"
                    : "border-[#2D3748]/10 hover:border-[#1A8A7A] hover:bg-slate-50 text-[#2D3748]/70 hover:text-[#0D1B2A]"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3 opacity-60" />
                  <span>{hour} WIB</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
