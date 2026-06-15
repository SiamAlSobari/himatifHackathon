"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import ChatPanel from "@/components/chat/ChatPanel";
import SummarySidebar from "@/components/chat/SummarySidebar";
import { useSession } from "next-auth/react";
import { useChatNotification } from "@/hooks/chat/useChatNotification";
import { useChatSession } from "@/hooks/chat/useChatSession";

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

  useEffect(() => {
    if (!isLoading && data && data.isOnboarded === false) {
      router.push("/screening");
    }
  }, [data, isLoading, router]);

  // Refetch data using TanStack Query when pusher triggers 'chat-finished'
  useChatNotification(
    session.data?.user?.id,
    () => {
      refetch();
    }
  );

  const messages = data?.activeSession?.chatMessages || [];
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

  const themeBg = themeBgMap[activeTheme as keyof typeof themeBgMap] || "bg-slate-50";

  return (
    <div className={`flex h-screen flex-col transition-colors duration-500 ${themeBg}`}>
      <Navbar />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden px-6 py-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-full min-h-0">
          <ChatPanel
            activeSession={data?.activeSession || null}
            cooldown={data?.cooldown || null}
            isLoading={isLoading}
            refetch={refetch}
            activeTheme={activeTheme}
          />
        </div>

        <div className="h-full min-h-0">
          <SummarySidebar
            latestAssistantMessage={latestAssistantMessage}
            latestScreening={data?.latestScreening || null}
          />
        </div>
      </main>
    </div>
  );
}