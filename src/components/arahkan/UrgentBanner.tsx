"use client"

interface UrgentBannerProps {
  onCall: () => void
}

export default function UrgentBanner({ onCall }: UrgentBannerProps) {
  return (
    <div className="bg-[#FCE6ED] rounded-2xl p-6 border border-[#b9003e]/10 transition-all duration-300 hover-lift shadow-premium hover:border-[#b9003e]/30">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="material-symbols-outlined text-[#b9003e] text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          emergency
        </span>
        <h3 className="text-[#b9003e] font-bold text-base">
          Bantuan Darurat
        </h3>
      </div>

      {/* Description */}
      <p className="text-xs text-[#3f484a] leading-relaxed mb-5">
        Jika Anda merasa dalam bahaya atau memerlukan bantuan segera, hubungi
        layanan krisis kami yang tersedia 24/7.
      </p>

      {/* CTA Button */}
      <button
        onClick={onCall}
        className="w-full bg-[#b9003e] text-white py-3.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
      >
        Hubungi Sekarang
      </button>

      {/* Priority label */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-[#b9003e] rounded-full" />
        <span className="text-[#b9003e] text-[11px] font-semibold">
          Layanan Prioritas Tanpa Antri
        </span>
      </div>
    </div>
  )
}
