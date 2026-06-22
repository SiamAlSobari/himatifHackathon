"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ClientItem } from "@/lib/types/dashboardpsikolog";
import { useRespondToBooking } from "@/hooks/psychologist/useRespondToBooking";
import { toast } from "sonner";

const priorityStyles: Record<ClientItem["priority"], string> = {
  "Prioritas Tinggi": "bg-rose-500 text-white",
  "Prioritas Rendah": "bg-emerald-600 text-white",
  "Prioritas Sedang": "bg-amber-500 text-white",
};

const levelStyles: Record<string, string> = {
  Rendah: "bg-emerald-100 text-emerald-600",
  Sedang: "bg-amber-100 text-amber-600",
  Tinggi: "bg-rose-100 text-rose-600",
};

interface ClientCardProps {
  client: ClientItem;
}

export default function ClientCard({ client }: ClientCardProps) {
  const { mutate: respond, isPending } = useRespondToBooking();

  const handleRespond = (action: "ACCEPT" | "DECLINE") => {
    if (!client.pendingAppointmentId) return;

    respond(
      { appointmentId: client.pendingAppointmentId, action },
      {
        onSuccess: () => {
          toast.success(action === "ACCEPT" ? "Booking berhasil diterima!" : "Booking berhasil ditolak!");
        },
        onError: (err: any) => {
          toast.error(err.message || "Gagal memproses booking.");
        },
      }
    );
  };

  return (
    <div className="group relative z-10 hover:z-30 rounded-xl border border-slate-100 p-4 bg-white shadow-premium hover-lift transition-all duration-300 hover:border-primary/20">
      {/* Default content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
            <Image
              src={client.image}
              alt={client.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {client.name}
            </p>
            <p className="text-xs text-slate-500">{client.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${priorityStyles[client.priority]}`}
          >
            {client.priority}
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span>Mood</span>
          <span className="ml-auto font-medium text-slate-700">
            {client.mood}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span>Tren</span>
          <span className="ml-auto font-medium text-slate-700">
            {client.trend}
          </span>
        </div>
      </div>

      {client.pendingAppointmentId && (
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRespond("ACCEPT")}
            className="flex-1 rounded-lg bg-emerald-100 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-200 disabled:opacity-50"
          >
            Accept
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => handleRespond("DECLINE")}
            className="flex-1 rounded-lg bg-rose-100 py-2 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-200 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}

      {/* Hover overlay */}
      <div className="pointer-events-none absolute top-full left-0 right-0 z-20 mt-2 flex flex-col gap-4 rounded-xl bg-white p-4 opacity-0 shadow-xl ring-1 ring-slate-200/50 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
            <Image
              src={client.image}
              alt={client.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {client.name}
            </p>
            <p className="text-xs text-slate-500">{client.role}</p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-600">
              Hasil Screening Terbaru
            </p>
            <div className="flex flex-col gap-2">
              {client.screeningResults.map((result) => (
                <div
                  key={result.label}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-[11px] text-slate-500">
                    {result.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${levelStyles[result.level]}`}
                  >
                    {result.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-600">
              Ringkasan Sesi AI
            </p>
            <ul className="flex flex-col gap-1.5">
              {client.aiSummary.map((point) => (
                <li
                  key={point}
                  className="flex gap-1.5 text-[11px] leading-snug text-slate-500"
                >
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  <span className="line-clamp-5">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}