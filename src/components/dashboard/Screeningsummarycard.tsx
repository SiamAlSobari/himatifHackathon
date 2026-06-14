import { ScreeningResult } from "@/lib/types/dashboard";
import ScreeningProgressBar from "./Screeningprogressbar";

interface ScreeningSummaryCardProps {
  title: string;
  results: ScreeningResult[];
  ctaLabel: string;
}

export default function ScreeningSummaryCard({
  title,
  results,
  ctaLabel,
}: ScreeningSummaryCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-base font-semibold text-slate-800">{title}</h2>

      <div className="flex flex-1 flex-col gap-5">
        {results.map((result) => (
          <ScreeningProgressBar key={result.label} {...result} />
        ))}
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
      >
        {ctaLabel}
      </button>
    </div>
  );
}