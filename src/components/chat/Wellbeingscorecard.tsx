import { useTheme } from "@/components/providers/ThemeProvider";

interface WellbeingScoreCardProps {
  score: number;
  maxScore: number;
  description: string;
}

const barColorMap = {
  calm_blue: "bg-teal-800",
  warm_yellow: "bg-amber-800",
  alert_orange: "bg-orange-850",
  deep_purple: "bg-indigo-850",
};

export default function WellbeingScoreCard({
  score,
  maxScore,
  description,
}: WellbeingScoreCardProps) {
  const percent = (score / maxScore) * 100;
  const { theme } = useTheme();
  const barColor = barColorMap[theme as keyof typeof barColorMap] || barColorMap.calm_blue;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          Skor Kesejahteraan
        </span>
        <span className="text-lg font-bold text-slate-900">
          {score}/{maxScore}
        </span>
      </div>

      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full origin-left animate-progress transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}