import { Bot, MoreVertical } from "lucide-react";

const headerAvatarColorMap = {
  calm_blue: "bg-teal-900",
  warm_yellow: "bg-amber-800",
  alert_orange: "bg-orange-600",
  deep_purple: "bg-indigo-900",
};

interface ChatHeaderProps {
  activeTheme?: string;
}

export default function ChatHeader({ activeTheme = "calm_blue" }: ChatHeaderProps) {
  const avatarBg = headerAvatarColorMap[activeTheme as keyof typeof headerAvatarColorMap] || "bg-teal-900";

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-500 ${avatarBg}`}>
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">LOMBUT AI</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Online</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Opsi lainnya"
        className="text-slate-400 hover:text-slate-600"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}