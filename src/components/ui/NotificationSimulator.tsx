"use client";

import React, { useState } from "react";
import { 
  Play, 
  Terminal, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Sparkles 
} from "lucide-react";
import { useSimulateNotification } from "@/hooks/useNotifications";
import { useTheme } from "@/components/providers/ThemeProvider";

const themeStyles = {
  calm_blue: {
    border: "border-teal-100",
    bg: "bg-teal-50/90",
    button: "bg-teal-800 hover:bg-teal-700 text-white",
    icon: "text-teal-600",
    title: "text-teal-900"
  },
  warm_yellow: {
    border: "border-amber-100",
    bg: "bg-amber-50/90",
    button: "bg-amber-800 hover:bg-amber-700 text-white",
    icon: "text-amber-600",
    title: "text-amber-900"
  },
  alert_orange: {
    border: "border-orange-100",
    bg: "bg-orange-50/90",
    button: "bg-orange-800 hover:bg-orange-700 text-white",
    icon: "text-orange-600",
    title: "text-orange-950"
  },
  deep_purple: {
    border: "border-indigo-100",
    bg: "bg-indigo-50/90",
    button: "bg-indigo-800 hover:bg-indigo-700 text-white",
    icon: "text-indigo-600",
    title: "text-indigo-950"
  }
};

export default function NotificationSimulator() {
  const { theme } = useTheme();
  const styles = themeStyles[theme] || themeStyles.calm_blue;
  const [isOpen, setIsOpen] = useState(false);
  const simulateMutation = useSimulateNotification();

  const handleSimulate = (type: string, title: string, message: string) => {
    simulateMutation.mutate({ type, title, message });
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3 font-sans">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer`}
        title="Simulasi Notifikasi"
      >
        {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Terminal className="h-5 w-5" />}
      </button>

      {/* Simulator Panel */}
      {isOpen && (
        <div 
          className={`flex flex-col w-64 rounded-2xl border ${styles.border} ${styles.bg} p-4 shadow-xl backdrop-blur-md animate-in slide-in-from-left-4 duration-300`}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className={`h-4 w-4 ${styles.icon}`} />
            <h4 className={`text-xs font-bold ${styles.title}`}>Simulasi Notifikasi</h4>
          </div>
          
          <p className="text-[10px] text-slate-500 font-semibold mb-3 leading-relaxed">
            Gunakan tombol di bawah ini untuk mensimulasikan notifikasi real-time ke aplikasi:
          </p>

          <div className="flex flex-col gap-2">
            {/* Booking Dokter */}
            <button
              onClick={() => handleSimulate(
                "BOOKING_DOCTOR", 
                "Booking Dokter Berhasil", 
                "Booking konsultasi dengan dr. Al Sobari, M.Psi. pada 23 Juni 2026 pukul 10:00 WIB telah disetujui."
              )}
              disabled={simulateMutation.isPending}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[10px] font-bold text-slate-700 border border-slate-100 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-sky-500" />
                <span>Booking Dokter</span>
              </div>
              <Play className="h-2.5 w-2.5 text-slate-400" />
            </button>

            {/* Mendekati Waktu Konsultasi */}
            <button
              onClick={() => handleSimulate(
                "APPOINTMENT_REMINDER", 
                "Konsultasi Segera Dimulai", 
                "Jadwal konsultasi Anda tinggal 15 menit lagi. Mohon persiapkan perangkat Anda."
              )}
              disabled={simulateMutation.isPending}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[10px] font-bold text-slate-700 border border-slate-100 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-rose-500" />
                <span>Mendekati Konsultasi</span>
              </div>
              <Play className="h-2.5 w-2.5 text-slate-400" />
            </button>

            {/* Chat Belum Terbaca */}
            <button
              onClick={() => handleSimulate(
                "UNREAD_CHAT", 
                "Pesan Baru dari dr. Al Sobari, M.Psi.", 
                "Halo, bagaimana perasaanmu sekarang? Silakan kabari saya jika sudah siap memulai chat."
              )}
              disabled={simulateMutation.isPending}
              className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[10px] font-bold text-slate-700 border border-slate-100 hover:bg-slate-50 transition-colors disabled:opacity-50 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                <span>Chat Psikolog (Unread)</span>
              </div>
              <Play className="h-2.5 w-2.5 text-slate-400" />
            </button>
          </div>

          {simulateMutation.isPending && (
            <p className="mt-2 text-[9px] text-center text-slate-400 font-medium"> Mengirim simulasi...</p>
          )}
        </div>
      )}
    </div>
  );
}
