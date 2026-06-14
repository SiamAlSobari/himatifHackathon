import { History } from "lucide-react";
import { ConsultationHistoryItem } from "@/lib/types/profile";

interface ConsultationHistoryCardProps {
  title: string;
  viewAllLabel: string;
  items: ConsultationHistoryItem[];
}

const STATUS_STYLES: Record<ConsultationHistoryItem["status"], string> = {
  Selesai: "bg-emerald-50 text-emerald-600",
  Dibatalkan: "bg-rose-50 text-rose-500",
  Berlangsung: "bg-amber-50 text-amber-600",
};

const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
];

export default function ConsultationHistoryCard({
  title,
  viewAllLabel,
  items,
}: ConsultationHistoryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4.5 w-4.5 text-slate-400" />
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        </div>
        <button
          type="button"
          className="text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          {viewAllLabel}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-120 text-left">
          <thead>
            <tr className="text-xs font-medium uppercase tracking-wide text-slate-400">
              <th className="pb-3 pr-4">Psikolog</th>
              <th className="pb-3 pr-4">Tanggal</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr key={item.id} className="text-sm">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        AVATAR_COLORS[index % AVATAR_COLORS.length]
                      }`}
                    >
                      {item.psychologistInitials}
                    </span>
                    <span className="font-medium text-slate-700">
                      {item.psychologistName}
                    </span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-slate-500">{item.date}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_STYLES[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}