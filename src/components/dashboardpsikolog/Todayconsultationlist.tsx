import { TodayConsultation } from "@/lib/types/dashboardpsikolog";
import TodayConsultationCard from "./Todayconsultationcard";

interface TodayConsultationListProps {
  consultations: TodayConsultation[];
}

export default function TodayConsultationList({
  consultations,
}: TodayConsultationListProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          Daftar Konsultasi Hari ini
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {consultations.length > 0 ? (
          consultations.map((item) => (
            <TodayConsultationCard key={item.id} consultation={item} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
            <span className="material-symbols-outlined text-3xl text-slate-300">
              calendar_today
            </span>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              Tidak ada jadwal konsultasi hari ini
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Jadwal yang dikonfirmasi oleh klien akan muncul di sini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}