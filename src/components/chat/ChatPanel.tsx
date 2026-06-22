"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Plus, Clock, HeartHandshake, Loader2, AlertTriangle } from "lucide-react";
import ChatHeader from "./ChatHeader";
import DateDivider from "./Datedivider";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useCreateChatSession } from "@/hooks/chat/useCreateChatSession";
import { useSendChatMessage } from "@/hooks/chat/useSendChatMessage";
import { useSession } from "next-auth/react";
import { ChatSessionWithMessages } from "@/lib/types/chat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  selectedHistorySession?: ChatSessionWithMessages | null;
}

export default function ChatPanel({
  activeSession,
  cooldown,
  isLoading,
  refetch,
  activeTheme = "calm_blue",
  selectedHistorySession = null,
}: ChatPanelProps) {
  const session = useSession();
  const createSessionMutation = useCreateChatSession();
  const sendMessageMutation = useSendChatMessage();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Determine actual session to display (selected history session, active session, or completed session during cooldown)
  const displaySession = selectedHistorySession || activeSession || cooldown?.completedSession || null;
  const messages = displaySession?.chatMessages || [];

  // Get message user is currently sending (for optimistic rendering)
  const pendingUserMessage = sendMessageMutation.isPending
    ? sendMessageMutation.variables?.message
    : null;

  const isReadOnly = !!selectedHistorySession || displaySession?.status === "COMPLETED" || displaySession?.status === "SEALED";

  // Determine if AI is currently typing (last message is from user OR user is sending a message)
  const isAiTyping =
    !isReadOnly &&
    ((activeSession &&
      messages.length > 0 &&
      messages[messages.length - 1].role === "USER") ||
    !!pendingUserMessage);

  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [lastSeenCrisisId, setLastSeenCrisisId] = useState<string | null>(null);

  // Crisis detection hook
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const messageAgeMs = Date.now() - new Date(lastMsg.createdAt).getTime();
      const isRecent = messageAgeMs < 15000; // Under 15 seconds

      if (
        lastMsg.role === "ASSISTANT" &&
        lastMsg.metaData?.isCrisis &&
        isRecent &&
        lastMsg.id !== lastSeenCrisisId
      ) {
        setLastSeenCrisisId(lastMsg.id);
        setShowCrisisModal(true);

        const timer = setTimeout(() => {
          setShowCrisisModal(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [messages, lastSeenCrisisId]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, sendMessageMutation.isPending, isAiTyping]);

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
          Mari bercerita tentang perasaanmu hari ini secara pribadi dan aman bersama Very AI. Kami siap membantumu kapan saja.
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
      <ChatHeader 
        activeTheme={activeTheme} 
        sessionId={displaySession?.id}
        ipfsCid={displaySession?.ipfsCid}
        txHash={displaySession?.txHash}
        status={displaySession?.status}
      />

      {/* Messages list container */}
      <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-4 min-h-0">
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
                  userImage={session.data?.user?.image}
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
                  userImage={session.data?.user?.image}
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

      </div>

      {/* Footer input area / Cooldown display */}
      {isReadOnly ? (
        <div className="border-t border-slate-100 bg-slate-50/70 p-6">
          <div className="rounded-xl border border-slate-200 bg-slate-100/50 p-4 shadow-sm text-center">
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Anda sedang melihat riwayat obrolan sesi sebelumnya. Sesi percakapan ini telah selesai dan bersifat arsip.
            </p>
          </div>
          <div className="mt-4">
            <ChatInput onSend={handleSend} disabled={true} activeTheme={activeTheme} />
          </div>
        </div>
      ) : cooldown?.active ? (
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
                href="/arahkan"
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
      <Dialog open={showCrisisModal} onOpenChange={setShowCrisisModal}>
        <DialogContent className="border-red-200 bg-red-50 p-6 text-center max-w-sm sm:max-w-md shadow-2xl">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-md animate-bounce">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <DialogTitle className="font-serif text-xl font-bold text-red-800 leading-tight">
              Peringatan: Kondisi Krisis Terdeteksi
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-red-700 leading-relaxed">
              Kami mendeteksi tingkat stres atau kondisi emosional Anda sangat tinggi dari obrolan terakhir. Tenang saja, Anda tidak sendirian. Silakan hubungi crisis center segera untuk mendapatkan pertolongan pertama secara gratis.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="tel:119"
              onClick={() => {
                setShowCrisisModal(false);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg active:scale-95 transition-all shadow-md shadow-red-600/10 cursor-pointer flex justify-center items-center gap-2"
            >
              <HeartHandshake className="h-4 w-4" />
              Hubungi Crisis Center (119)
            </a>
            <button
              onClick={() => setShowCrisisModal(false)}
              className="w-full py-2.5 border border-red-300 text-red-700 hover:bg-red-100/50 font-medium rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              Tutup Peringatan
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}