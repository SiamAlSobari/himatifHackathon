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
        {consultations.map((item) => (
          <TodayConsultationCard key={item.id} consultation={item} />
        ))}
      </div>
    </section>
  );
}