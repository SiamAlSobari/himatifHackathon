"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Bot, Plus, Clock, HeartHandshake, Loader2 } from "lucide-react";
import ChatHeader from "./ChatHeader";
import DateDivider from "./Datedivider";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useCreateChatSession } from "@/hooks/chat/useCreateChatSession";
import { useSendChatMessage } from "@/hooks/chat/useSendChatMessage";
import { ChatSessionWithMessages } from "@/lib/types/chat";

interface ChatPanelProps {
  activeSession: ChatSessionWithMessages | null;
  cooldown: {
    active: boolean;
    remainingHours: number;
    completedSessionId: string | null;
    completedSession?: ChatSessionWithMessages | null;
  } | null;
  isLoading: boolean;
  refetch: () => void;
  activeTheme: string;
}

export default function ChatPanel({
  activeSession,
  cooldown,
  isLoading,
  refetch,
  activeTheme = "calm_blue",
}: ChatPanelProps) {
  const createSessionMutation = useCreateChatSession();
  const sendMessageMutation = useSendChatMessage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Determine actual session to display (active session or completed session during cooldown)
  const displaySession = activeSession || cooldown?.completedSession || null;
  const messages = displaySession?.chatMessages || [];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, sendMessageMutation.isPending]);

  // Handle message sending
  const handleSend = (text: string) => {
    if (!activeSession) return;
    sendMessageMutation.mutate({
      sessionId: activeSession.id,
      message: text,
    });
  };

  // Handle creating new session
  const handleCreateSession = () => {
    createSessionMutation.mutate(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Get message user is currently sending (for optimistic rendering)
  const pendingUserMessage = sendMessageMutation.isPending
    ? sendMessageMutation.variables?.message
    : null;

  // Determine if AI is currently typing (last message is from user OR user is sending a message)
  const isAiTyping =
    (activeSession &&
      messages.length > 0 &&
      messages[messages.length - 1].role === "USER") ||
    !!pendingUserMessage;

  // Loading state
  if (isLoading) {
    return (
      <section className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <Loader2 className="h-10 w-10 animate-spin text-teal-800" />
        <p className="mt-3 text-sm font-semibold text-slate-500">Memuat sesi obrolan...</p>
      </section>
    );
  }

  // No active session & no cooldown -> Start new session screen
  if (!activeSession && (!cooldown || !cooldown.active)) {
    return (
      <section className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-800 shadow-inner">
          <Bot className="h-8 w-8 animate-pulse text-teal-800" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-800">
          Mulai Percakapan Baru
        </h3>
        <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-400">
          Mari bercerita tentang perasaanmu hari ini secara pribadi dan aman bersama Lombut AI. Kami siap membantumu kapan saja.
        </p>
        <button
          onClick={handleCreateSession}
          disabled={createSessionMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-800 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {createSessionMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Tambah Sesi Sekarang
        </button>
      </section>
    );
  }

  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <ChatHeader activeTheme={activeTheme} />

      {/* Messages list container */}
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4 min-h-0">
        {messages.length === 0 && !pendingUserMessage ? (
          <div className="flex h-full items-center justify-center text-slate-400 text-xs">
            Tidak ada pesan. Mulai obrolan sekarang.
          </div>
        ) : (
          <>
            <DateDivider label="Hari Ini" />
            {messages.map((msg) => {
              const dateObj = new Date(msg.createdAt);
              const formattedTime = isNaN(dateObj.getTime())
                ? "00:00"
                : dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <ChatBubble
                  key={msg.id}
                  sender={msg.role === "ASSISTANT" ? "ai" : "user"}
                  message={msg.content}
                  time={formattedTime}
                />
              );
            })}

            {/* Optimistic rendering of pending user message */}
            {pendingUserMessage && (
              <div className="opacity-70">
                <ChatBubble
                  sender="user"
                  message={pendingUserMessage}
                  time={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                />
              </div>
            )}
          </>
        )}

        {/* Typing indicator bubble */}
        {isAiTyping && (
          <ChatBubble
            sender="ai"
            message=""
            time=""
            isTyping={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer input area / Cooldown display */}
      {cooldown?.active ? (
        <div className="border-t border-slate-100 bg-slate-50/70 p-6">
          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-start md:text-left">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm animate-pulse">
                <Clock className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 leading-snug">
                  Batas Sesi Harian Tercapai
                </p>
                <p className="mt-1 text-xs text-amber-700/95 leading-relaxed">
                  Anda dapat membuat sesi lagi setelah <span className="font-bold">{cooldown.remainingHours} jam</span>. Ingin konsultasi dengan psikolog sekarang?
                </p>
              </div>
              <Link
                href="/konsultasi"
                className="inline-flex items-center gap-2 rounded-lg bg-rose-700 hover:bg-rose-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <HeartHandshake className="h-4 w-4" />
                Hubungi Psikolog
              </Link>
            </div>
          </div>
          {/* Render input disabled below cooldown banner to match requirement */}
          <div className="mt-4">
            <ChatInput onSend={handleSend} disabled={true} activeTheme={activeTheme} />
          </div>
        </div>
      ) : (
        <ChatInput
          onSend={handleSend}
          disabled={sendMessageMutation.isPending || isAiTyping}
          activeTheme={activeTheme}
        />
      )}
    </section>
  );
}