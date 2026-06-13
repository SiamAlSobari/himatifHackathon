import { Sparkle } from "lucide-react";

export default function CrisisHelpCard() {
  return (
    <div className="rounded-xl border border-rose-100 bg-rose-50 p-5">
      <div className="mb-2 flex items-center gap-2">
        <Sparkle className="h-4 w-4 fill-rose-500 text-rose-500" />
        <h2 className="text-sm font-semibold text-rose-600">
          Bantuan Segera
        </h2>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-slate-500">
        Jika Anda merasa dalam bahaya atau memerlukan intervensi krisis
        mendesak.
      </p>

      <button
        type="button"
        className="w-full rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600"
      >
        Hubungi Crisis Center
      </button>
    </div>
  );
}