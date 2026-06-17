import { Calendar, Lock } from "lucide-react";
import Image from "next/image";
import { ScheduleItem } from "@/lib/types/dashboard";

interface ScheduleCardProps {
  title: string;
  viewAllLabel: string;
  items: ScheduleItem[];
}

function ScheduleRow({ name, role, avatarUrl, dateLabel, locked }: ScheduleItem) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition-colors ${
        locked ? "opacity-60" : "hover:border-teal-100 hover:bg-teal-50/40"
      }`}
    >
      <Image
        src={avatarUrl}
        alt={name}
        width={44}
        height={44}
        className="h-11 w-11 rounded-full object-cover"
      />

      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="text-xs text-slate-400">{role}</p>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{dateLabel}</span>
        </div>
      </div>

      {locked && <Lock className="h-4 w-4 text-slate-300" />}
    </div>
  );
}

export default function ScheduleCard({
  title,
  viewAllLabel,
  items,
}: ScheduleCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <button
          type="button"
          className="text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          {viewAllLabel}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <ScheduleRow key={item.id} {...item} />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-slate-500">
            <span className="material-symbols-outlined text-3xl text-slate-300">
              event_busy
            </span>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              Belum ada jadwal konsultasi mendatang
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Silakan jadwalkan sesi bersama spesialis di menu Arahkan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}