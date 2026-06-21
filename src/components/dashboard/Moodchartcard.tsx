import { MoodDataPoint } from "@/lib/types/dashboard";

interface MoodChartCardProps {
  title: string;
  rangeLabel: string;
  data: MoodDataPoint[];
  selectedDay?: string | null;
  onBarClick?: (day: string, value: number, screeningResults: any[] | null) => void;
}

const MAX_VALUE = 100;
const CHART_HEIGHT = 160;

export default function MoodChartCard({
  title,
  rangeLabel,
  data,
  selectedDay = null,
  onBarClick,
}: MoodChartCardProps) {
  const isAnySelected = selectedDay !== null;

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

          const isSelected = selectedDay === point.day;
          
          let barColorClass = "";
          if (isSelected) {
            barColorClass = "bg-primary brightness-125 shadow-[0_4px_12px_rgba(0,67,73,0.15)] scale-x-105 ring-2 ring-primary/20";
          } else if (isAnySelected) {
            barColorClass = "bg-slate-200 opacity-50 hover:opacity-85 hover:bg-primary/20";
          } else {
            if (point.isToday) {
              barColorClass = "bg-primary/80 hover:brightness-95";
            } else {
              barColorClass = "bg-slate-100 hover:bg-primary/10";
            }
          }

          return (
            <div
              key={point.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <button
                type="button"
                onClick={() => onBarClick?.(point.day, point.value, point.screeningResults || null)}
                className={`w-full rounded-md transition-all duration-300 cursor-pointer outline-none ${barColorClass}`}
                style={{ height: barHeight }}
                aria-label={`${point.day}: ${point.value}%`}
                title={`${point.day}: ${point.value}%`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isSelected
                    ? "text-primary font-bold"
                    : point.isToday
                    ? "text-primary/80 font-semibold"
                    : "text-slate-400"
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