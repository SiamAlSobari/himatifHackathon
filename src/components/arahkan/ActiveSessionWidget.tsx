"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface ActiveSessionWidgetProps {
  psychologistName: string | null
  scheduledAt: string | null
  appointmentId: string | null
  visible: boolean
  onClose: () => void
}

export default function ActiveSessionWidget({
  psychologistName,
  scheduledAt,
  appointmentId,
  visible,
  onClose,
}: ActiveSessionWidgetProps) {
  const [status, setStatus] = useState<"upcoming" | "active" | "ended">("upcoming")
  const [msUntilStart, setMsUntilStart] = useState<number>(0)

  useEffect(() => {
    if (!scheduledAt) return

    const scheduledTime = new Date(scheduledAt).getTime()
    const durationMs = 25 * 60 * 1000 // 25 minutes session duration

    const checkStatus = () => {
      const now = new Date().getTime()
      const endTime = scheduledTime + durationMs

      if (now < scheduledTime) {
        setStatus("upcoming")
        setMsUntilStart(scheduledTime - now)
      } else if (now >= scheduledTime && now <= endTime) {
        setStatus("active")
        setMsUntilStart(0)
      } else {
        setStatus("ended")
        setMsUntilStart(0)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 1000)
    return () => clearInterval(interval)
  }, [scheduledAt])

  if (!psychologistName || !visible || status === "ended") return null

  const isUpcoming = status === "upcoming"

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    const hrsStr = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : ""
    const minsStr = mins.toString().padStart(2, "0")
    const secsStr = secs.toString().padStart(2, "0")

    return `${hrsStr}${minsStr}:${secsStr}`
  }

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
            ? `Mulai dalam ${formatCountdown(msUntilStart)}`
            : "Masuk ruang chat sekarang"}
        </p>
      </div>
    </div>
  )

  if (isUpcoming) {
    return (
      <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2 bg-[#1a3a4a]/95 text-white pl-4 pr-3 py-3 rounded-full shadow-lg border border-amber-500/30 cursor-not-allowed select-none">
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
      href={`/konsultasi?appointmentId=${appointmentId}`}
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2 bg-primary text-white pl-4 pr-3 py-3 rounded-full shadow-lg hover:bg-primary-container border border-emerald-500/20 transition-all active:scale-95 cursor-pointer"
    >
      {content}

      {/* Close button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClose()
        }}
        className="ml-1 text-white/80 hover:text-white transition-colors cursor-pointer"
        aria-label="Tutup widget"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </Link>
  )
}
