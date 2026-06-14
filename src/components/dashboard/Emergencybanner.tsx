import { Phone, Sparkles } from "lucide-react";

interface EmergencyBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  phoneNumber: string;
}

export default function EmergencyBanner({
  title,
  description,
  ctaLabel,
  phoneNumber,
}: EmergencyBannerProps) {
  return (
    <section className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-rose-50 p-6 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <button
        type="button"
        className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-rose-600"
      >
        <Phone className="h-4 w-4" />
        {ctaLabel} ({phoneNumber})
      </button>
    </section>
  );
}