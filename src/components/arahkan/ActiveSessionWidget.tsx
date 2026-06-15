"use client"

import Link from "next/link"

interface ActiveSessionWidgetProps {
  psychologistName: string | null
  visible: boolean
  onClose: () => void
}

export default function ActiveSessionWidget({
  psychologistName,
  visible,
  onClose,
}: ActiveSessionWidgetProps) {
  if (!psychologistName || !visible) return null

  return (
    <Link
      href="/chat"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-3 bg-[#1a3a4a] text-white pl-4 pr-3 py-3 rounded-full shadow-lg hover:bg-[#0b2c3c] transition-colors cursor-pointer"
    >
      {/* Teal dot indicator */}
      <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shrink-0" />

      <div className="min-w-0">
        <p className="text-xs font-bold leading-tight">Konsultasi Aktif</p>
        <p className="text-[10px] text-white/60 font-medium truncate">
          Sedang terhubung...
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
        className="ml-1 text-white/40 hover:text-white transition-colors cursor-pointer"
        aria-label="Tutup widget"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </Link>
  )
}
