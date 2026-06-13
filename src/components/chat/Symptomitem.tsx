import { LucideIcon } from "lucide-react";
import LevelIndicator from "./LevelIndicator";

interface SymptomItemProps {
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  title: string;
  status: string;
  level: 1 | 2 | 3;
  levelColor: "teal" | "rose";
}

export default function SymptomItem({
  icon: Icon,
  iconBgClass,
  iconColorClass,
  title,
  status,
  level,
  levelColor,
}: SymptomItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBgClass}`}
        >
          <Icon className={`h-4 w-4 ${iconColorClass}`} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-400">{status}</p>
        </div>
      </div>

      <LevelIndicator level={level} color={levelColor} />
    </div>
  );
}