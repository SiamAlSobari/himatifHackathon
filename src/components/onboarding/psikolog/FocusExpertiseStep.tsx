"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { FOCUS_AREAS, EXPERTISE_TAGS } from "@/lib/types/psychologist-onboarding";

interface FocusExpertiseStepProps {
  focusArea: string;
  setFocusArea: (area: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  styles: any;
}

export default function FocusExpertiseStep({
  focusArea,
  setFocusArea,
  selectedTags,
  toggleTag,
  styles,
}: FocusExpertiseStepProps) {
  return (
    <div className="space-y-6">
      {/* Focus Area Grid */}
      <div className="space-y-3">
        <Label className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1 block">
          Fokus Bidang Utama (Pilih Salah Satu)
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {FOCUS_AREAS.map((area) => {
            const isSelected = focusArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setFocusArea(area)}
                className={`px-4 py-3 rounded-2xl border text-left text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? `${styles.cardSelect} border-2 ring-2 ring-teal-500/10`
                    : "border-[#2D3748]/10 hover:border-[#1A8A7A]/30 hover:bg-slate-50 text-[#2D3748]/80 hover:text-[#0D1B2A]"
                }`}
              >
                <span>{area}</span>
                <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                  isSelected 
                    ? "bg-[#1A8A7A] border-transparent text-white" 
                    : "border-slate-300 group-hover:border-[#1A8A7A] text-transparent"
                }`}>
                  <Check className="h-3 w-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expertise Tags Chips list */}
      <div className="pt-4 border-t border-[#2D3748]/5 space-y-3">
        <div className="space-y-1 ml-1">
          <Label className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase block">
            Spesialisasi Detail / Tag Keahlian (Pilih Beberapa)
          </Label>
          <p className="text-[10px] text-[#2D3748]/40 font-medium">
            Membantu mempermudah klien menemukan keahlian spesifik Anda saat pencarian.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXPERTISE_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isSelected
                    ? "bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white border-transparent shadow-md shadow-[#0D1B2A]/10"
                    : "border-[#2D3748]/10 hover:border-[#1A8A7A] hover:bg-slate-50 text-[#2D3748]/60 hover:text-[#0D1B2A]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
