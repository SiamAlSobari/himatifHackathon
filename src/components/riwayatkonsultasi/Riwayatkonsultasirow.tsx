import { ConsultationHistoryItem } from "@/lib/types/dashboardpsikolog";

const statusStyles: Record<ConsultationHistoryItem["status"], string> = {
  Selesai: "bg-emerald-100 text-emerald-600",
  Dijadwalkan: "bg-blue-100 text-blue-600",
  Dibatalkan: "bg-rose-100 text-rose-600",
};

interface RiwayatKonsultasiRowProps {
  item: ConsultationHistoryItem;
}

export default function RiwayatKonsultasiRow({
  item,
}: RiwayatKonsultasiRowProps) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
            {item.psychologInitials}
          </span>
          <span className="font-semibold text-slate-800">
            {item.psychologName}
          </span>
        </div>
      </td>
      <td className="py-4 pr-4 text-slate-500">{item.date}</td>
      <td className="py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );
}