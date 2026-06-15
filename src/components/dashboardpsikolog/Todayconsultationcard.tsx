import Image from "next/image";
import { Video } from "lucide-react";
import { TodayConsultation } from "@/lib/types/dashboardpsikolog";

const statusStyles: Record<TodayConsultation["status"], string> = {
  Berlangsung: "bg-emerald-100 text-emerald-600",
  Terjadwal: "bg-blue-100 text-blue-600",
};

interface TodayConsultationCardProps {
  consultation: TodayConsultation;
}

export default function TodayConsultationCard({
  consultation,
}: TodayConsultationCardProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-slate-100">
          <Image
            src={consultation.clientImage}
            alt={consultation.clientName}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {consultation.clientName}
          </p>
          <p className="text-xs text-slate-500">{consultation.clientRole}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <Video className="h-3.5 w-3.5" />
            <span>{consultation.schedule}</span>
          </div>
        </div>
      </div>

      <span
        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[consultation.status]}`}
      >
        {consultation.status}
      </span>
    </div>
  );
}