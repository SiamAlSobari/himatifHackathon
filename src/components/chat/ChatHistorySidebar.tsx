"use client";

import { MessageSquare, History, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { ChatSessionWithMessages } from "@/lib/types/chat";
import { AppTheme } from "@/lib/types/theme";

interface ChatHistorySidebarProps {
  history: ChatSessionWithMessages[];
  activeSession: ChatSessionWithMessages | null;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string | null) => void;
  activeTheme?: AppTheme;
  isCreatingSession?: boolean;
  onCreateSession?: () => void;
  cooldownActive?: boolean;
}

const themeStyleMap = {
  calm_blue: {
    border: "border-teal-100/60",
    headerBg: "bg-teal-50/40",
    activeText: "text-teal-900 font-bold",
    activeBg: "bg-teal-50/60",
    activeBorder: "border-teal-400",
    buttonBg: "bg-teal-800 hover:bg-teal-700",
    dotColor: "bg-teal-500",
    hoverBg: "hover:bg-slate-50",
  },
  warm_yellow: {
    border: "border-amber-100/60",
    headerBg: "bg-amber-50/40",
    activeText: "text-amber-900 font-bold",
    activeBg: "bg-amber-50/60",
    activeBorder: "border-amber-400",
    buttonBg: "bg-amber-800 hover:bg-amber-700",
    dotColor: "bg-amber-500",
    hoverBg: "hover:bg-slate-50",
  },
  alert_orange: {
    border: "border-orange-100/60",
    headerBg: "bg-orange-50/40",
    activeText: "text-orange-900 font-bold",
    activeBg: "bg-orange-50/60",
    activeBorder: "border-orange-400",
    buttonBg: "bg-orange-800 hover:bg-orange-700",
    dotColor: "bg-orange-500",
    hoverBg: "hover:bg-slate-50",
  },
  deep_purple: {
    border: "border-indigo-100/60",
    headerBg: "bg-indigo-50/40",
    activeText: "text-indigo-900 font-bold",
    activeBg: "bg-indigo-50/60",
    activeBorder: "border-indigo-400",
    buttonBg: "bg-indigo-800 hover:bg-indigo-700",
    dotColor: "bg-indigo-500",
    hoverBg: "hover:bg-slate-50",
  },
};

export default function ChatHistorySidebar({
  history,
  activeSession,
  selectedSessionId,
  onSelectSession,
  activeTheme = "calm_blue",
  isCreatingSession = false,
  onCreateSession,
  cooldownActive = false,
}: ChatHistorySidebarProps) {
  const styles = themeStyleMap[activeTheme] || themeStyleMap.calm_blue;

  const getSessionDetails = (session: ChatSessionWithMessages) => {
    const assistantMsgs = session.chatMessages.filter((m) => m.role === "ASSISTANT");
    const latestMsg = assistantMsgs.length > 0 ? assistantMsgs[assistantMsgs.length - 1] : null;
    const theme = latestMsg?.metaData?.uiTheme || "calm_blue";

    let label = "Stabil";
    let colorClass = "bg-teal-50 text-teal-800 border-teal-200/50";
    if (theme === "warm_yellow") {
      label = "Lelah";
      colorClass = "bg-amber-50 text-amber-800 border-amber-200/50";
    } else if (theme === "alert_orange") {
      label = "Cemas";
      colorClass = "bg-orange-50 text-orange-800 border-orange-200/50";
    } else if (theme === "deep_purple") {
      label = "Berat";
      colorClass = "bg-indigo-50 text-indigo-800 border-indigo-200/50";
    }

    const formattedDate = new Date(session.createdAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return { label, colorClass, formattedDate };
  };

  const isCurrentActiveSelected = selectedSessionId === null;

  return (
    <aside className={`flex h-full flex-col gap-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm`}>
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-slate-500" />
        <h2 className="text-base font-semibold text-slate-800">Riwayat Obrolan</h2>
      </div>

      {/* Action Area: Back to active or Create new session */}
      <div className="space-y-2">
        {activeSession ? (
          <button
            onClick={() => onSelectSession(null)}
            className={`w-full flex items-center justify-between p-3.5 text-xs rounded-xl border transition-all cursor-pointer ${
              isCurrentActiveSelected
                ? `${styles.activeBg} ${styles.activeBorder} ${styles.activeText}`
                : `bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70`
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${styles.dotColor} animate-pulse`} />
              <span className="font-semibold text-left">Sesi Chat Aktif</span>
            </div>
            {isCurrentActiveSelected ? (
              <span className="text-[10px] uppercase font-bold text-slate-400">Sedang Dibuka</span>
            ) : (
              <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
        ) : (
          !cooldownActive && onCreateSession && (
            <button
              onClick={onCreateSession}
              disabled={isCreatingSession}
              className={`w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-white rounded-xl shadow-sm transition-all cursor-pointer ${styles.buttonBg}`}
            >
              {isCreatingSession ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Mulai Obrolan Baru
            </button>
          )
        )}
      </div>

      {/* History List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-8 text-center text-slate-400">
            <MessageSquare className="h-8 w-8 text-slate-250 mb-2 opacity-50" />
            <p className="text-xs">Belum ada riwayat obrolan sebelumnya.</p>
          </div>
        ) : (
          history.map((session) => {
            const { label, colorClass, formattedDate } = getSessionDetails(session);
            const isSelected = selectedSessionId === session.id;

            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${styles.activeBg} ${styles.activeBorder} ${styles.activeText}`
                    : `bg-white border-slate-100 ${styles.hoverBg}`
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Sesi {formattedDate}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${colorClass}`}>
                    {label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed">
                  {session.chatMessages.find(m => m.role === "USER")?.content || 
                   session.sessionSummary?.summary || 
                   "Sapaan Awal AI"}
                </p>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
