import { MoodDataPoint } from "@/lib/types/dashboard";

interface MoodChartCardProps {
  title: string;
  rangeLabel: string;
  data: MoodDataPoint[];
}

const MAX_VALUE = 100;
const CHART_HEIGHT = 160;

export default function MoodChartCard({
  title,
  rangeLabel,
  data,
}: MoodChartCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
          {rangeLabel}
        </span>
      </div>

      <div
        className="flex items-end justify-between gap-3"
        style={{ height: CHART_HEIGHT }}
      >
        {data.map((point) => {
          const barHeight = Math.max(
            (point.value / MAX_VALUE) * CHART_HEIGHT,
            12
          );

          return (
            <div
              key={point.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className={`w-full rounded-md transition-all duration-300 ${
                  point.isToday
                    ? "bg-teal-600/70"
                    : "bg-slate-100 hover:bg-teal-100"
                }`}
                style={{ height: barHeight }}
                aria-label={`${point.day}: ${point.value}`}
              />
              <span
                className={`text-xs font-medium ${
                  point.isToday ? "text-teal-700" : "text-slate-400"
                }`}
              >
                {point.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}