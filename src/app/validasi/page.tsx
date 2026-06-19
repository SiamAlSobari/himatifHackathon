"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPanel from "@/components/chat/ChatPanel";
import SummarySidebar from "@/components/chat/SummarySidebar";
import ChatHistorySidebar from "@/components/chat/ChatHistorySidebar";
import { useSession } from "next-auth/react";
import { useChatNotification } from "@/hooks/chat/useChatNotification";
import { useChatSession } from "@/hooks/chat/useChatSession";
import { useCreateChatSession } from "@/hooks/chat/useCreateChatSession";
import { useTheme } from "@/components/providers/ThemeProvider";
import { AppTheme } from "@/lib/types/theme";

// Theme mappings for the outer wrapper
const themeBgMap = {
  calm_blue: "bg-sky-50/50",
  warm_yellow: "bg-amber-50/40",
  alert_orange: "bg-orange-50/40",
  deep_purple: "bg-indigo-50/40",
};

export default function ChatPage() {
  const session = useSession();
  const router = useRouter();
  const { data, isLoading, refetch } = useChatSession();
  const createSessionMutation = useCreateChatSession();
  const { setTheme } = useTheme();

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Reset selected history session if active session becomes available
  useEffect(() => {
    if (data?.activeSession) {
      setSelectedSessionId(null);
    }
  }, [data?.activeSession?.id]);

  useEffect(() => {
    if (!isLoading && data) {
      if (data.isOnboarded === false || data.hasScreenedToday === false) {
        router.push("/screening");
      }
    }
  }, [data, isLoading, router]);

  // Refetch data using TanStack Query when pusher triggers 'chat-finished'
  useChatNotification(
    session.data?.user?.id,
    () => {
      refetch();
    }
  );

  const selectedHistorySession = data?.history?.find((s) => s.id === selectedSessionId) || null;

  // Determine actual session to display (selected history session, active session, or completed session during cooldown)
  const displaySession = selectedHistorySession || data?.activeSession || null;
  const messages = displaySession?.chatMessages || [];
  const assistantMessages = messages.filter((m) => m.role === "ASSISTANT");
  const latestAssistantMessage =
    assistantMessages.length > 0
      ? assistantMessages[assistantMessages.length - 1]
      : null;

  const getThemeFromScore = (score?: number) => {
    if (score === undefined || score === null) return "calm_blue";
    if (score <= 3) return "calm_blue";
    if (score <= 6) return "warm_yellow";
    if (score <= 9) return "alert_orange";
    return "deep_purple";
  };

  const activeTheme =
    latestAssistantMessage?.metaData?.uiTheme ||
    getThemeFromScore(data?.latestScreening?.score) ||
    "calm_blue";

  // Update the global theme whenever activeTheme changes (from AI response or latest screening)
  useEffect(() => {
    if (activeTheme) {
      setTheme(activeTheme as AppTheme);
    }
  }, [activeTheme, setTheme]);

  const handleCreateSession = () => {
    createSessionMutation.mutate(undefined, {
      onSuccess: () => {
        setSelectedSessionId(null);
        refetch();
      },
    });
  };

  const themeBg = themeBgMap[activeTheme as keyof typeof themeBgMap] || "bg-slate-50";

  return (
    <div className={`flex h-[calc(100vh-64px)] flex-col transition-colors duration-500 ${themeBg}`}>
      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden px-6 py-4 lg:grid-cols-4">
        {/* Left Column: Sesi Sidebar */}
        <div className="h-full min-h-0 lg:col-span-1">
          <ChatHistorySidebar
            history={data?.history || []}
            activeSession={data?.activeSession || null}
            selectedSessionId={selectedSessionId}
            onSelectSession={setSelectedSessionId}
            activeTheme={activeTheme as AppTheme}
            isCreatingSession={createSessionMutation.isPending}
            onCreateSession={handleCreateSession}
            cooldownActive={data?.cooldown?.active}
          />
        </div>

        {/* Middle Column: Chat Panel */}
        <div className="lg:col-span-2 h-full min-h-0">
          <ChatPanel
            activeSession={data?.activeSession || null}
            cooldown={data?.cooldown || null}
            isLoading={isLoading}
            refetch={refetch}
            activeTheme={activeTheme}
            selectedHistorySession={selectedHistorySession}
          />
        </div>

        {/* Right Column: Summary Sidebar */}
        <div className="h-full min-h-0 lg:col-span-1">
          <SummarySidebar
            latestAssistantMessage={latestAssistantMessage}
            latestScreening={data?.latestScreening || null}
          />
        </div>
      </main>
    </div>
  );
}