import { Bot, MoreVertical, RotateCcw, Loader2 } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

const headerAvatarColorMap = {
  calm_blue: "bg-teal-900",
  warm_yellow: "bg-amber-800",
  alert_orange: "bg-orange-600",
  deep_purple: "bg-indigo-900",
};

interface ChatHeaderProps {
  activeTheme?: string;
  sessionId?: string;
  ipfsCid?: string | null;
  txHash?: string | null;
  status?: string;
  hasBeenReset?: boolean;
  onResetSession?: () => void;
  isResetting?: boolean;
}

export default function ChatHeader({
  activeTheme = "calm_blue",
  sessionId,
  ipfsCid,
  txHash,
  status,
  hasBeenReset,
  onResetSession,
  isResetting,
}: ChatHeaderProps) {
  const avatarBg = headerAvatarColorMap[activeTheme as keyof typeof headerAvatarColorMap] || "bg-teal-900";
  const isFinished = status === "COMPLETED" || status === "SEALED" || !!(ipfsCid || txHash);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-500 ${avatarBg}`}>
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">VERY AI</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {sessionId && !isFinished && !hasBeenReset && (
          <button
            onClick={onResetSession}
            disabled={isResetting}
            title="Reset Percakapan"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
          >
            {isResetting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Reset Sesi
          </button>
        )}

        {sessionId && isFinished && (
          <VerificationBadge
            sessionId={sessionId}
            initialIpfsCid={ipfsCid}
            initialTxHash={txHash}
          />
        )}
        
        <button
          type="button"
          aria-label="Opsi lainnya"
          className="text-slate-400 hover:text-slate-600"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}