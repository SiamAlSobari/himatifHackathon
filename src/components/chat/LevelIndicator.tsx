import { useTheme } from "@/components/providers/ThemeProvider";

interface LevelIndicatorProps {
  level: 1 | 2 | 3;
  color: "teal" | "rose";
}

const themeColorMap = {
  calm_blue: "bg-teal-800",
  warm_yellow: "bg-amber-800",
  alert_orange: "bg-orange-850",
  deep_purple: "bg-indigo-850",
};

const inactiveColor = "bg-slate-200";

export default function LevelIndicator({ level, color }: LevelIndicatorProps) {
  const { theme } = useTheme();
  const activeColor = color === "teal"
    ? (themeColorMap[theme as keyof typeof themeColorMap] || themeColorMap.calm_blue)
    : "bg-rose-500";

  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((index) => (
        <span
          key={index}
          className={`h-5 w-1.5 rounded-full ${
            index <= level ? activeColor : inactiveColor
          }`}
        />
      ))}
    </div>
  );
}