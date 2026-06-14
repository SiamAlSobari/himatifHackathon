import { Sparkles } from "lucide-react";

interface DashboardHeaderProps {
  name: string;
}

export default function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
            Halo, {name}.
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Bagaimana perasaanmu hari ini? Luangkan waktu sejenak untuk
            mengenali dirimu sendiri.
          </p>
        </div>

        <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-teal-100 bg-linear-to-br from-teal-50 to-emerald-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-teal-600 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-teal-600/70">
                Skor Hari Ini
              </p>
              <p className="text-sm font-semibold text-teal-800">
                Tenang &amp; Stabil
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}