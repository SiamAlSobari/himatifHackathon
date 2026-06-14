"use client"

import { cn } from "@/lib/utils"

interface OnboardingOptionCardProps {
  emoji?: string
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
  size?: "sm" | "md" | "lg"
}

export default function OnboardingOptionCard({
  emoji,
  label,
  description,
  selected,
  onSelect,
  size = "md",
}: OnboardingOptionCardProps) {
  const padding =
    size === "sm"
      ? "px-4 py-3"
      : size === "lg"
        ? "px-6 py-5"
        : "px-5 py-4"

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.99]",
        padding,
        selected
          ? "border-[#1A8A7A] bg-[#1A8A7A]/5 shadow-md shadow-[#1A8A7A]/10"
          : "border-black/10 bg-white hover:border-[#1A8A7A]/40 hover:bg-[#F0F4F8]/60 hover:shadow-sm"
      )}
    >
      {emoji && (
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl bg-[#F0F4F8] text-2xl transition-transform duration-200",
            size === "sm" ? "h-9 w-9" : "h-11 w-11",
            selected && "scale-110 bg-[#1A8A7A]/10"
          )}
        >
          {emoji}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-semibold text-[#0D1B2A] leading-tight",
            size === "sm" ? "text-sm" : "text-base"
          )}
        >
          {label}
        </p>
        {description && (
          <p
            className={cn(
              "mt-0.5 text-[#2D3748]/60 leading-snug",
              size === "sm" ? "text-[11px]" : "text-xs"
            )}
          >
            {description}
          </p>
        )}
      </div>

      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border-2 transition-all",
          size === "sm" ? "h-5 w-5" : "h-6 w-6",
          selected
            ? "border-[#1A8A7A] bg-[#1A8A7A]"
            : "border-black/15 bg-white group-hover:border-[#1A8A7A]/40"
        )}
      >
        {selected && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <polyline points="5 12 10 17 19 7" />
          </svg>
        )}
      </span>
    </button>
  )
}
