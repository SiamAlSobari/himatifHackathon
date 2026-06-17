import { ClientItem } from "@/lib/types/dashboardpsikolog";
import ClientCard from "./Clientcard";
import Link from "next/link";

interface ClientListSectionProps {
  clients: ClientItem[];
}

export default function ClientListSection({
  clients,
}: ClientListSectionProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">
          List Client
        </h2>
        <Link
          href="/psikolog/clientlist"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>
      <p className="mb-4 text-sm text-slate-400">List client terbaru kamu</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.length > 0 ? (
          clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
            <span className="material-symbols-outlined text-3xl text-slate-300">
              group
            </span>
            <p className="mt-2 text-xs font-semibold text-slate-600">
              Belum ada klien terdaftar
            </p>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Klien baru akan terdaftar saat menjadwalkan konsultasi dengan Anda.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}