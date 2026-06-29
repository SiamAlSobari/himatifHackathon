"use client";

import { History } from "lucide-react";
import type { PsychologistConsultationHistoryItem } from "@/lib/types/psychologist-profile";

interface PsychologistConsultationHistoryCardProps {
  items: PsychologistConsultationHistoryItem[];
}

const STATUS_STYLES: Record<PsychologistConsultationHistoryItem["status"], string> = {
  Selesai:    "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Dijadwalkan:"bg-amber-50  text-amber-600  border border-amber-100",
  Dibatalkan: "bg-rose-50   text-rose-500   border border-rose-100",
  Kadaluwarsa: "bg-slate-50  text-slate-500  border border-slate-200",
};

const AVATAR_COLORS = [
  "bg-teal-50  text-teal-600",
  "bg-indigo-50 text-indigo-600",
  "bg-violet-50 text-violet-600",
  "bg-sky-50   text-sky-600",
];

export default function PsychologistConsultationHistoryCard({
  items,
}: PsychologistConsultationHistoryCardProps) {
  const hasHistory = items && items.length > 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-300 hover-lift">
      <div className="mb-5 flex items-center gap-2">
        <History className="h-4 w-4 text-slate-400" />
        <h2 className="text-base font-bold text-slate-800">Riwayat Sesi Klien</h2>
      </div>

      {!hasHistory ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 p-8 text-center">
          <History className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500">Belum ada riwayat sesi</p>
          <p className="text-xs text-slate-400 mt-1">Riwayat sesi konsultasi dengan klien akan tampil di sini.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100/50">
                <th className="pb-3 pr-4">Klien</th>
                <th className="pb-3 pr-4">Tanggal</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, idx) => (
                <tr key={item.id} className="text-sm group hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform duration-300 group-hover:scale-105 ${
                          AVATAR_COLORS[idx % AVATAR_COLORS.length]
                        }`}
                      >
                        {item.clientInitials}
                      </span>
                      <span className="font-bold text-slate-700">{item.clientName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500 font-medium">{item.date}</td>
                  <td className="py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
