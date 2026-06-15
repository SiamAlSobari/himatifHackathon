import { ClientItem } from "@/lib/types/dashboardpsikolog";
import ClientCard from "../dashboardpsikolog/Clientcard";

interface ClientListGridProps {
  clients: ClientItem[];
}

export default function ClientListGrid({ clients }: ClientListGridProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-800">
          List Client
        </h2>
        <p className="text-sm text-slate-400">List client terbaru kamu</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </section>
  );
}