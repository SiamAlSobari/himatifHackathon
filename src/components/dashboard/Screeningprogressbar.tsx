import { ScreeningResult } from "@/lib/types/dashboard";

const STATUS_STYLES: Record<
  ScreeningResult["status"],
  { badge: string; bar: string }
> = {
  Rendah: {
    badge: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-400",
  },
  Sedang: {
    badge: "bg-amber-50 text-amber-600",
    bar: "bg-amber-400",
  },
  Tinggi: {
    badge: "bg-rose-50 text-rose-600",
    bar: "bg-rose-400",
  },
};

export default function ScreeningProgressBar({
  label,
  status,
  progress,
}: ScreeningResult) {
  const styles = STATUS_STYLES[status];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.badge}`}
        >
          {status}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${styles.bar} transition-all duration-500 origin-left animate-progress`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}