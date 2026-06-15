import { History } from "lucide-react";
import { ConsultationHistoryItem } from "@/lib/types/dashboardpsikolog";
import RiwayatKonsultasiRow from "./Riwayatkonsultasirow";

interface RiwayatKonsultasiCardProps {
  history: ConsultationHistoryItem[];
}

export default function RiwayatKonsultasiCard({
  history,
}: RiwayatKonsultasiCardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-indigo-600">
        <History className="h-4 w-4" />
        Riwayat Konsultasi
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-slate-100 pb-3 pr-4 font-semibold text-slate-700">
                Psikolog
              </th>
              <th className="border-b border-slate-100 pb-3 pr-4 font-semibold text-slate-700">
                Tanggal
              </th>
              <th className="border-b border-slate-100 pb-3 font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <RiwayatKonsultasiRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}