"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface ActiveSessionWidgetProps {
  psychologistName: string | null
  scheduledAt: string | null
  visible: boolean
  onClose: () => void
}

export default function ActiveSessionWidget({
  psychologistName,
  scheduledAt,
  visible,
  onClose,
}: ActiveSessionWidgetProps) {
  const [status, setStatus] = useState<"upcoming" | "active" | "ended">("upcoming")

  useEffect(() => {
    if (!scheduledAt) return

    const scheduledTime = new Date(scheduledAt).getTime()
    const durationMs = 25 * 60 * 1000 // 25 minutes session duration

    const checkStatus = () => {
      const now = new Date().getTime()
      const endTime = scheduledTime + durationMs

      if (now < scheduledTime) {
        setStatus("upcoming")
      } else if (now >= scheduledTime && now <= endTime) {
        setStatus("active")
      } else {
        setStatus("ended")
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 1000)
    return () => clearInterval(interval)
  }, [scheduledAt])

  if (!psychologistName || !visible || status === "ended") return null

  const isUpcoming = status === "upcoming"

  const content = (
    <div className="flex items-center gap-3">
      {/* Indicator dot */}
      <span
        className={`w-3 h-3 rounded-full animate-pulse shrink-0 ${
          isUpcoming ? "bg-amber-400" : "bg-emerald-400"
        }`}
      />

      <div className="min-w-0 pr-2">
        <p className="text-xs font-bold leading-tight">
          {isUpcoming ? "Menunggu Jadwal" : "Konsultasi Aktif"}
        </p>
        <p className="text-[10px] text-white/60 font-medium truncate">
          {isUpcoming
            ? `Mulai ${new Date(scheduledAt!).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })} WIB`
            : "Klik untuk masuk chat"}
        </p>
      </div>
    </div>
  )

  if (isUpcoming) {
    return (
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2 bg-[#1a3a4a]/95 text-white pl-4 pr-3 py-3 rounded-full shadow-lg border border-amber-500/20 select-none">
        {content}

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
      </div>
    )
  }

  return (
    <Link
      href="/konsultasi"
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2 bg-[#1a3a4a] text-white pl-4 pr-3 py-3 rounded-full shadow-lg hover:bg-[#0b2c3c] transition-colors cursor-pointer"
    >
      {content}

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
