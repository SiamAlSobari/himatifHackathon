import React, { useEffect, useRef } from "react";
import { ArrowLeft, MessageSquare, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { ConsultationHistoryListItem, ConsultationHistoryMessage } from "@/lib/types/consultation-history";

interface ChatAreaProps {
  appointment: ConsultationHistoryListItem | null;
  messages: ConsultationHistoryMessage[];
  isLoading: boolean;
  userRole: "USER" | "PSYCHOLOGY";
  onBack: () => void;
}

export default function ChatArea({
  appointment,
  messages,
  isLoading,
  userRole,
  onBack,
}: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!appointment) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50/50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 animate-pulse">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Riwayat Percakapan</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          Pilih salah satu sesi konsultasi di sebelah kiri untuk meninjau riwayat percakapan secara lengkap.
        </p>
      </div>
    );
  }

  // Determine message alignment
  // If sender matches user's role: right side (self)
  // Else: left side (other party)
  const isSelf = (sender: "psychologist" | "user") => {
    if (userRole === "PSYCHOLOGY" && sender === "psychologist") return true;
    if (userRole === "USER" && sender === "user") return true;
    return false;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {appointment.otherPartyImage ? (
            <img
              src={appointment.otherPartyImage}
              alt={appointment.otherPartyName}
              className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary border border-primary/20">
              {getInitials(appointment.otherPartyName)}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate leading-tight">
              {appointment.otherPartyName}
            </h4>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {appointment.otherPartyRole}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {appointment.status === "COMPLETED" ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Selesai
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-xs font-semibold">
              <XCircle className="h-3.5 w-3.5" />
              Dibatalkan
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-slate-400 font-medium">Memuat pesan riwayat...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <ShieldAlert className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-500">Tidak ada pesan</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Sesi konsultasi ini diselesaikan tanpa ada pesan yang dikirimkan.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const self = isSelf(msg.sender);
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${self ? "justify-end" : "justify-start"}`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                    self
                      ? "bg-primary text-white rounded-tr-sm"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                  }`}
                >
                  <p className="whitespace-pre-line text-[13px] md:text-sm">{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] text-right font-medium tracking-wide ${
                      self ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer Informational Badge */}
      <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3 text-center">
        <p className="text-xs font-medium text-slate-400">
          Sesi konsultasi telah berakhir. Riwayat chat ini bersifat arsip dan tidak dapat diubah.
        </p>
      </div>
    </div>
  );
}
