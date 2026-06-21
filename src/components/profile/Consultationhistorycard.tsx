import { History } from "lucide-react";
import { ConsultationHistoryItem } from "@/lib/types/profile";

interface ConsultationHistoryCardProps {
  title: string;
  viewAllLabel: string;
  items: ConsultationHistoryItem[];
}

const STATUS_STYLES: Record<ConsultationHistoryItem["status"], string> = {
  Selesai: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Dibatalkan: "bg-rose-50 text-rose-500 border border-rose-100",
  Berlangsung: "bg-amber-50 text-amber-600 border border-amber-100",
};

const AVATAR_COLORS = [
  "bg-primary/10 text-primary",
  "bg-indigo-50 text-indigo-600",
  "bg-violet-50 text-violet-600",
  "bg-sky-50 text-sky-600",
];

export default function ConsultationHistoryCard({
  title,
  viewAllLabel,
  items,
}: ConsultationHistoryCardProps) {
  const hasHistory = items && items.length > 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-slate-400 animate-spin-slow" />
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
        </div>
        {hasHistory && (
          <button
            type="button"
            className="text-xs font-bold text-primary transition-colors hover:opacity-85"
          >
            {viewAllLabel}
          </button>
        )}
      </div>

      {!hasHistory ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 p-8 text-center">
          <History className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-500">Belum ada riwayat konsultasi</p>
          <p className="text-xs text-slate-400 mt-1">Jadwal konsultasi Anda dengan psikolog mitra akan muncul di sini.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100/50">
                <th className="pb-3 pr-4">Psikolog</th>
                <th className="pb-3 pr-4">Tanggal</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => (
                <tr key={item.id} className="text-sm group hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform duration-300 group-hover:scale-105 ${
                          AVATAR_COLORS[index % AVATAR_COLORS.length]
                        }`}
                      >
                        {item.psychologistInitials}
                      </span>
                      <span className="font-bold text-slate-700">
                        {item.psychologistName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500 font-medium">{item.date}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        STATUS_STYLES[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      className="text-xs font-bold text-primary transition-all duration-300 hover:underline hover:opacity-85"
                    >
                      Detail
                    </button>
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