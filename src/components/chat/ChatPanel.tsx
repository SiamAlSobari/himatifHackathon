"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Bot, Plus, Clock, HeartHandshake, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import DateDivider from "./Datedivider";
import ChatBubble from "./ChatBubble";
import ChatInput from "./ChatInput";
import { useCreateChatSession } from "@/hooks/chat/useCreateChatSession";
import { useSendChatMessage } from "@/hooks/chat/useSendChatMessage";
import { useSession } from "next-auth/react";
import { ChatSessionWithMessages } from "@/lib/types/chat";
import { useProfile } from "@/hooks/profile/useProfile";
import { useResetChatSession } from "@/hooks/chat/useResetChatSession";
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
  streamingMessage?: string | null;
}

const themeStylesMap = {
  calm_blue: {
    iconBg: "bg-teal-50",
    iconColor: "text-teal-850",
    buttonBg: "bg-teal-800 hover:bg-teal-700",
    loaderColor: "text-teal-800",
  },
  warm_yellow: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-850",
    buttonBg: "bg-amber-800 hover:bg-amber-700",
    loaderColor: "text-amber-800",
  },
  alert_orange: {
    iconBg: "bg-orange-50",
    iconColor: "text-orange-850",
    buttonBg: "bg-orange-800 hover:bg-orange-700",
    loaderColor: "text-orange-800",
  },
  deep_purple: {
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-850",
    buttonBg: "bg-indigo-800 hover:bg-indigo-700",
    loaderColor: "text-indigo-850",
  },
};

export default function ChatPanel({
  activeSession,
  cooldown,
  isLoading,
  refetch,
  activeTheme = "calm_blue",
  selectedHistorySession = null,
  streamingMessage = null,
}: ChatPanelProps) {
  const session = useSession();
  const { data: profile } = useProfile();
  const createSessionMutation = useCreateChatSession();
  const sendMessageMutation = useSendChatMessage();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sentCountRef = useRef<number>(0);
  
  const [optimisticUserMessage, setOptimisticUserMessage] = useState<string | null>(null);
  const [localCreating, setLocalCreating] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const resetSessionMutation = useResetChatSession();

  const themeStyles = themeStylesMap[activeTheme as keyof typeof themeStylesMap] || themeStylesMap.calm_blue;

  // Determine actual session to display (selected history session, active session, or completed session during cooldown)
  const displaySession = selectedHistorySession || activeSession || cooldown?.completedSession || null;
  const messages = displaySession?.chatMessages || [];

  const userGender = profile?.dbUser?.jenisKelamin;
  const userPlaceholder = (userGender === "LAKI_LAKI" || userGender === "male")
    ? "https://cdn-icons-png.freepik.com/512/219/219988.png"
    : "https://cdn-icons-png.freepik.com/512/219/219969.png";
  const finalUserImage = profile?.dbUser?.image || session.data?.user?.image || userPlaceholder;

  // Reset optimistic user message once the message is saved in DB list
  // ponytail: track message length to avoid clearing optimistic user message prematurely due to stale assistant message status
  useEffect(() => {
    if (optimisticUserMessage && messages.length > sentCountRef.current) {
      setOptimisticUserMessage(null);
    }
  }, [messages.length, optimisticUserMessage]);

  // Get message user is currently sending (for optimistic rendering)
  const pendingUserMessage = optimisticUserMessage;

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

  // Auto scroll ke bawah setiap ada pesan baru atau chunk stream baru
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages.length, pendingUserMessage, streamingMessage]);

  // Handle message sending
  const handleSend = (text: string) => {
    if (!activeSession) return;
    sentCountRef.current = messages.length;
    setOptimisticUserMessage(text);
    sendMessageMutation.mutate({
      sessionId: activeSession.id,
      message: text,
    }, {
      onError: () => {
        setOptimisticUserMessage(null);
      }
    });
  };

  // Handle creating new session
  const handleCreateSession = () => {
    setLocalCreating(true);
    createSessionMutation.mutate(undefined, {
      onSuccess: async () => {
        await refetch();
        setLocalCreating(false);
      },
      onError: () => {
        setLocalCreating(false);
      },
    });
  };

  const handleResetSession = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmReset = () => {
    if (!activeSession) return;
    setShowResetConfirm(false);
    resetSessionMutation.mutate(activeSession.id, {
      onSuccess: async () => {
        await refetch();
        toast.success("Sesi chat berhasil diulang dari awal!");
      },
      onError: (err: any) => {
        toast.error(err.message || "Gagal mereset sesi chat");
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
        <Loader2 className={`h-10 w-10 animate-spin ${themeStyles.loaderColor}`} />
        <p className="mt-3 text-sm font-semibold text-slate-500">Memuat sesi obrolan...</p>
      </section>
    );
  }

  // No active session & no cooldown -> Start new session screen
  if (!activeSession && (!cooldown || !cooldown.active)) {
    return (
      <section className="flex h-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full shadow-inner ${themeStyles.iconBg}`}>
          <Bot className={`h-8 w-8 animate-pulse ${themeStyles.iconColor}`} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-slate-800">
          Mulai Percakapan Baru
        </h3>
        <p className="mb-6 max-w-md text-sm leading-relaxed text-slate-400">
          Mari bercerita tentang perasaanmu hari ini secara pribadi dan aman bersama Very AI. Kami siap membantumu kapan saja.
        </p>
        <button
          onClick={handleCreateSession}
          disabled={createSessionMutation.isPending || localCreating}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer ${themeStyles.buttonBg}`}
        >
          {createSessionMutation.isPending || localCreating ? (
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
        hasBeenReset={displaySession?.hasBeenReset}
        onResetSession={handleResetSession}
        isResetting={resetSessionMutation.isPending}
      />

      {/* Messages list container */}
      <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-4 min-h-0">
        {messages.length === 0 && !pendingUserMessage && !streamingMessage ? (
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
                  userImage={finalUserImage}
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
                  userImage={finalUserImage}
                />
              </div>
            )}

            {/* Streamed content or typing indicator */}
            {streamingMessage ? (
              <ChatBubble
                sender="ai"
                message={streamingMessage}
                time={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              />
            ) : isAiTyping ? (
              <ChatBubble
                sender="ai"
                message=""
                time=""
                isTyping={true}
              />
            ) : null}
          </>
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

      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="border-slate-200 bg-white p-6 text-center max-w-sm sm:max-w-md shadow-2xl rounded-2xl outline-none">
          <DialogHeader className="flex flex-col items-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100 shadow-inner">
              <RotateCcw className="h-6 w-6 animate-pulse" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-800 leading-tight">
              Reset Sesi Percakapan?
            </DialogTitle>
            <DialogDescription className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
              Tindakan ini akan menghapus seluruh riwayat pesan pada sesi aktif saat ini dan mengulang sesi kembali dari awal. **Fitur ini hanya dapat digunakan 1 kali per sesi.** Apakah Anda yakin?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
            >
              Batalkan
            </button>
            <button
              onClick={handleConfirmReset}
              className={`flex-1 py-2.5 text-white font-semibold text-xs rounded-xl active:scale-95 transition-all shadow-md cursor-pointer flex justify-center items-center gap-1.5 ${themeStyles.buttonBg}`}
            >
              Ya, Reset Sesi
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}