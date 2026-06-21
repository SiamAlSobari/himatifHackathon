import { ScreeningResult } from "@/lib/types/dashboard";
import ScreeningProgressBar from "./Screeningprogressbar";

interface ScreeningSummaryCardProps {
  title: string;
  results: ScreeningResult[] | null;
  ctaLabel: string;
  dayLabel?: string | null;
  onCtaClick?: () => void;
}

export default function ScreeningSummaryCard({
  title,
  results,
  ctaLabel,
  dayLabel = null,
  onCtaClick,
}: ScreeningSummaryCardProps) {
  const hasResults = results && results.length > 0;
  const displayTitle = dayLabel ? `${title} (${dayLabel})` : title;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-slate-800 transition-colors">
        {displayTitle}
      </h2>

      <div className="flex flex-1 flex-col gap-5 justify-center">
        {hasResults ? (
          results.map((result) => (
            <ScreeningProgressBar key={result.label} {...result} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <span className="material-symbols-outlined text-slate-400 text-3xl mb-2" style={{ fontVariationSettings: "'FILL' 0" }}>
              monitoring
            </span>
            <p className="text-xs font-bold text-slate-700">Tidak Ada Data</p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mt-1">
              Anda belum melakukan screening kesehatan mental pada hari {dayLabel || "ini"}.
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onCtaClick}
        className="mt-6 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary cursor-pointer outline-none"
      >
        {ctaLabel}
      </button>
    </div>
  );
}