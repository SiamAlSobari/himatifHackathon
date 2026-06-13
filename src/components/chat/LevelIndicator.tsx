interface LevelIndicatorProps {
  level: 1 | 2 | 3;
  color: "teal" | "rose";
}

const colorMap = {
  teal: "bg-teal-800",
  rose: "bg-rose-500",
};

const inactiveColor = "bg-slate-200";

export default function LevelIndicator({ level, color }: LevelIndicatorProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map((index) => (
        <span
          key={index}
          className={`h-5 w-1.5 rounded-full ${
            index <= level ? colorMap[color] : inactiveColor
          }`}
        />
      ))}
    </div>
  );
}