"use client"

import { cn } from "@/lib/utils"
import { ONBOARDING_STEPS, type OnboardingStep } from "@/lib/types/onboarding"

interface OnboardingProgressProps {
  currentStep: OnboardingStep
  onStepClick?: (step: OnboardingStep) => void
}

export default function OnboardingProgress({
  currentStep,
  onStepClick,
}: OnboardingProgressProps) {
  const currentIndex = ONBOARDING_STEPS.indexOf(currentStep)
  const isWelcome = currentStep === "welcome"

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#2D3748]/60">
        <span>
          Langkah {isWelcome ? "1" : currentIndex + 1} dari {ONBOARDING_STEPS.length}
        </span>
        <span className="text-[#1A8A7A]">
          {isWelcome ? "Ayo mulai" : `${Math.round((currentIndex / (ONBOARDING_STEPS.length - 1)) * 100)}%`}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {ONBOARDING_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex
          const isCurrent = idx === currentIndex
          const isClickable = !!onStepClick && isCompleted

          return (
            <button
              key={step}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(step)}
              className={cn(
                "group relative h-1.5 flex-1 overflow-hidden rounded-full transition-all",
                isClickable && "cursor-pointer hover:h-2",
                !isClickable && "cursor-default"
              )}
              aria-label={`Step ${idx + 1}`}
            >
              <span
                className={cn(
                  "absolute inset-0 transition-colors duration-300",
                  isCompleted
                    ? "bg-[#1A8A7A]"
                    : isCurrent
                      ? "bg-[#1A8A7A]/15"
                      : "bg-black/10"
                )}
              />
              {(isCompleted || isCurrent) && (
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-500",
                    isCompleted
                      ? "w-full bg-[#1A8A7A]"
                      : "w-1/2 bg-gradient-to-r from-[#1A8A7A] to-[#1A8A7A]/60"
                  )}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
