import Image from "next/image";
import { Video } from "lucide-react";
import { TodayConsultation } from "@/lib/types/dashboardpsikolog";
import Link from "next/link";

const statusStyles: Record<TodayConsultation["status"], string> = {
  Berlangsung: "bg-emerald-100 text-emerald-600",
  Terjadwal: "bg-blue-100 text-blue-600",
  Selesai: "bg-slate-100 text-slate-400 border border-slate-200",
};

interface TodayConsultationCardProps {
  consultation: TodayConsultation;
}

export default function TodayConsultationCard({
  consultation,
}: TodayConsultationCardProps) {
  const isFinished = consultation.status === "Selesai";

  const cardContent = (
    <>
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
          <p className={`text-sm font-semibold ${isFinished ? "text-slate-400 line-through" : "text-slate-800"}`}>
            {consultation.clientName}
          </p>
          <p className={`text-xs ${isFinished ? "text-slate-400" : "text-slate-500"}`}>{consultation.clientRole}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <span className="material-symbols-outlined text-slate-400">
              chat_bubble
            </span>
            <span>{consultation.schedule}</span>
          </div>
        </div>
      </div>

      <span
        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[consultation.status]}`}
      >
        {consultation.status}
      </span>
    </>
  );

  if (isFinished) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-3 select-none opacity-80">
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/psikolog/konsultasi?appointmentId=${consultation.id}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 bg-white hover:bg-slate-50 transition-all duration-300 hover-lift-sm shadow-premium hover:border-primary/20 cursor-pointer"
    >
      {cardContent}
    </Link>
  );
}