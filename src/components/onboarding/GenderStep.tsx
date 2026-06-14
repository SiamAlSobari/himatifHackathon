"use client"

import { Users } from "lucide-react"
import OnboardingOptionCard from "./OnboardingOptionCard"
import { GENDER_OPTIONS, type GenderId } from "@/lib/types/onboarding"

interface GenderStepProps {
  selected: GenderId | null
  onSelect: (id: GenderId) => void
  onNext: () => void
  onBack: () => void
}

export default function GenderStep({
  selected,
  onSelect,
  onNext,
  onBack,
}: GenderStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F4F8]">
          <Users className="h-4 w-4 text-[#0D1B2A]" />
        </div>
        <div className="text-xs leading-relaxed text-[#2D3748]/70">
          <strong className="font-bold text-[#0D1B2A]">Bicara lebih natural.</strong>{" "}
          Supaya AI bisa nyapa kamu dengan cara yang bikin kamu nyaman.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {GENDER_OPTIONS.map((opt) => (
          <OnboardingOptionCard
            key={opt.id}
            emoji={opt.emoji}
            label={opt.label}
            description={opt.description}
            selected={selected === opt.id}
            onSelect={() => onSelect(opt.id)}
            size="sm"
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-3 py-2 text-sm font-semibold text-[#2D3748]/70 transition-colors hover:bg-black/5 hover:text-[#0D1B2A] cursor-pointer"
        >
          ← Kembali
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1A8A7A] hover:shadow-lg hover:shadow-[#1A8A7A]/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          Lanjut
          <svg
            className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
