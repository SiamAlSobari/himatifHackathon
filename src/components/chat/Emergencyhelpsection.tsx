import { Sparkle } from "lucide-react";

export default function EmergencyHelpSection() {
  return (
    <div className="border-t border-slate-200 pt-4">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B9003C] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#9B0032] hover:scale-[1.01] active:scale-[0.99] shadow-sm cursor-pointer"
      >
        <Sparkle className="h-4 w-4 fill-white" />
        Butuh Bantuan Segera?
      </button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Jika Anda dalam bahaya, harap hubungi layanan darurat setempat.
      </p>
    </div>
  );
}