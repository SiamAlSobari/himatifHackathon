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
          href="/clientlist"
          className="text-sm font-medium text-emerald-600 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>
      <p className="mb-4 text-sm text-slate-400">List client terbaru kamu</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </section>
  );
}