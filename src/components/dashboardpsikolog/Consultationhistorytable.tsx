import { History } from "lucide-react";
import { ConsultationHistoryItem } from "@/lib/types/dashboardpsikolog";
import Link from "next/link";

const statusStyles: Record<ConsultationHistoryItem["status"], string> = {
  Selesai: "bg-emerald-100 text-emerald-600",
  Dijadwalkan: "bg-blue-100 text-blue-600",
  Dibatalkan: "bg-rose-100 text-rose-600",
};

interface ConsultationHistoryTableProps {
  history: ConsultationHistoryItem[];
}

export default function ConsultationHistoryTable({
  history,
}: ConsultationHistoryTableProps) {
  return (
    <section className="rounded-2xl bg-white p-5 border border-slate-100 shadow-premium hover-lift transition-all duration-300 hover:border-primary/20 h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <History className="h-4 w-4 text-slate-400" />
          Riwayat Konsultasi
        </h2>

        <Link
          href="/riwayatkonsultasi"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-400">
              <th className="py-3 font-medium align-middle">Nama Klien</th>
              <th className="py-3 font-medium align-middle">Tanggal</th>
              <th className="py-3 font-medium align-middle">Status</th>
            </tr>
          </thead>

          <tbody>
            {history.length > 0 ? (
              history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors duration-200"
                >
                  <td className="py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                        {item.psychologInitials}
                      </span>

                      <span className="font-medium text-slate-700">
                        {item.clientName}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-slate-500 align-middle">
                    {item.date}
                  </td>

                  <td className="py-4 align-middle">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-slate-300">
                      history_toggle_off
                    </span>
                    <p className="mt-2 text-xs font-semibold text-slate-500">
                      Belum ada riwayat sesi konsultasi
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Sesi konsultasi yang telah selesai akan tercatat di sini.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}