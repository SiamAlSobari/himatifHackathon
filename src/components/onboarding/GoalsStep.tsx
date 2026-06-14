"use client"

import { Heart } from "lucide-react"
import OnboardingOptionCard from "./OnboardingOptionCard"
import { GOAL_OPTIONS, type GoalId } from "@/lib/types/onboarding"

interface GoalsStepProps {
  selected: GoalId | null
  onSelect: (id: GoalId) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}

export default function GoalsStep({
  selected,
  onSelect,
  onNext,
  onBack,
  loading,
}: GoalsStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-[#1A8A7A]/15 bg-[#1A8A7A]/5 p-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
          <Heart className="h-4 w-4 text-[#1A8A7A]" />
        </div>
        <div className="text-xs leading-relaxed text-[#2D3748]/70">
          <strong className="font-bold text-[#0D1B2A]">Pilih yang paling dekat.</strong>{" "}
          Bisa lebih dari satu nanti, tapi untuk sekarang pilih satu dulu aja.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {GOAL_OPTIONS.map((opt) => (
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
          disabled={loading}
          className="rounded-full px-3 py-2 text-sm font-semibold text-[#2D3748]/70 transition-colors hover:bg-black/5 hover:text-[#0D1B2A] disabled:opacity-50 cursor-pointer"
        >
          ← Kembali
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!selected || loading}
          className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1A8A7A] hover:shadow-lg hover:shadow-[#1A8A7A]/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="3"
                />
                <path
                  d="M12 2a10 10 0 0110 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              Selesai &amp; Mulai Screening
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
            </>
          )}
        </button>
      </div>
    </div>
  )
}
