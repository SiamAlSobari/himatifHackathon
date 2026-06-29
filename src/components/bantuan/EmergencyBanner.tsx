"use client"

import React from "react"
import { useTheme } from "@/components/providers/ThemeProvider"
import { AppTheme } from "@/lib/types/theme"

const themeColors: Record<
  AppTheme,
  {
    bg: string
    border: string
    text: string
    subtext: string
    iconBg: string
    iconColor: string
    btnHover: string
    btnBorderHover: string
    btnGlow: string
  }
> = {
  calm_blue: {
    bg: "bg-red-50/60 backdrop-blur-sm",
    border: "border-red-200/60",
    text: "text-red-950",
    subtext: "text-red-800/80",
    iconBg: "bg-white/80",
    iconColor: "text-red-600",
    btnHover: "hover:bg-red-50 hover:text-red-700",
    btnBorderHover: "hover:border-red-200",
    btnGlow: "hover:shadow-red-200/30"
  },
  warm_yellow: {
    bg: "bg-red-50/60 backdrop-blur-sm",
    border: "border-red-200/60",
    text: "text-red-950",
    subtext: "text-red-800/80",
    iconBg: "bg-white/80",
    iconColor: "text-red-600",
    btnHover: "hover:bg-red-50 hover:text-red-700",
    btnBorderHover: "hover:border-red-200",
    btnGlow: "hover:shadow-red-200/30"
  },
  alert_orange: {
    bg: "bg-orange-50/60 backdrop-blur-sm",
    border: "border-orange-200/60",
    text: "text-orange-950",
    subtext: "text-orange-850/80",
    iconBg: "bg-white/80",
    iconColor: "text-orange-600",
    btnHover: "hover:bg-orange-50 hover:text-orange-700",
    btnBorderHover: "hover:border-orange-200",
    btnGlow: "hover:shadow-orange-200/30"
  },
  deep_purple: {
    bg: "bg-rose-50/60 backdrop-blur-sm",
    border: "border-rose-200/60",
    text: "text-rose-950",
    subtext: "text-rose-850/80",
    iconBg: "bg-white/80",
    iconColor: "text-rose-600",
    btnHover: "hover:bg-rose-50 hover:text-rose-700",
    btnBorderHover: "hover:border-rose-200",
    btnGlow: "hover:shadow-rose-200/30"
  }
}

export default function EmergencyBanner() {
  const { theme } = useTheme()
  const c = themeColors[theme] || themeColors.calm_blue

  return (
    <div 
      className={`p-6 rounded-3xl border ${c.bg} ${c.border} shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md`}
    >
      {/* Background Icon Decoration */}
      <div 
        className="absolute -right-6 -top-6 opacity-[0.05] pointer-events-none select-none"
      >
        <span className="material-symbols-outlined text-[140px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          emergency
        </span>
      </div>
      
      <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start">
        <div 
          className={`shrink-0 mt-1 ${c.iconColor} ${c.iconBg} p-3 rounded-2xl border border-white/40 shadow-sm transition-all duration-300 hover:scale-110`}
        >
          <span 
            className="material-symbols-outlined text-3xl sm:text-4xl flex items-center justify-center animate-pulse select-none" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            support_agent
          </span>
        </div>
        
        <div className="flex-grow">
          <h3 className={`font-extrabold text-lg sm:text-xl mb-2 flex items-center gap-2 ${c.text}`}>
            Anda Tidak Sendirian.
          </h3>
          <p className={`text-xs sm:text-sm font-medium mb-5 leading-relaxed ${c.subtext} max-w-xl`}>
            Jika Anda atau seseorang yang Anda kenal sedang mengalami krisis, merasa sangat putus asa, atau memiliki pemikiran untuk menyakiti diri sendiri, mohon segera hubungi layanan darurat di bawah ini:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <a 
              href="tel:119" 
              className={`flex items-center justify-center gap-2 px-4.5 py-2.5 bg-white rounded-xl border border-slate-200/60 font-bold text-xs sm:text-sm shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${c.btnHover} ${c.btnBorderHover} ${c.btnGlow}`}
            >
              <span className={`material-symbols-outlined text-lg sm:text-xl ${c.iconColor} select-none`}>call</span>
              Layanan Sejiwa (119 ext 8)
            </a>
            <a 
              href="tel:129" 
              className={`flex items-center justify-center gap-2 px-4.5 py-2.5 bg-white rounded-xl border border-slate-200/60 font-bold text-xs sm:text-sm shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${c.btnHover} ${c.btnBorderHover} ${c.btnGlow}`}
            >
              <span className={`material-symbols-outlined text-lg sm:text-xl ${c.iconColor} select-none`}>call</span>
              Layanan SAPA (129)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
