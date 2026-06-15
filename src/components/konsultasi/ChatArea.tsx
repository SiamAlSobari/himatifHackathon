"use client";

import React, { useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "psychologist" | "user";
  text: string;
  time: string;
}

interface ChatAreaProps {
  psychologistName: string;
  psychologistRole: string;
  psychologistImage: string;
  isOnline: boolean;
  isTyping: boolean;
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  isDisabled?: boolean;
}

export default function ChatArea({
  psychologistName,
  psychologistRole,
  psychologistImage,
  isOnline,
  isTyping,
  messages,
  inputValue,
  setInputValue,
  onSend,
  isDisabled = false,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSend();
    }
  };

  return (
    <section className="flex-1 flex flex-col h-[750px] bg-surface-container-lowest border border-outline-variant rounded-xl soft-bloom overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-subtle">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-fixed shadow-sm"
              alt={psychologistName}
              src={psychologistImage}
            />
            {(isOnline || isTyping) && (
              <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isTyping ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
            )}
          </div>
          <div>
            <h2 className={`font-headline-md font-bold text-primary transition-all duration-300 ${isOnline || isTyping ? "text-body-lg" : "text-xl"}`}>
              {psychologistName}
            </h2>
            {(isOnline || isTyping) && (
              <div className="flex items-center gap-1">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isTyping ? "text-amber-600 animate-pulse" : "text-green-600"}`}>
                  {isTyping ? "Mengetik..." : "Online"}
                </span>
              </div>
            )}
          </div>
        </div>
        <button className="material-symbols-outlined text-outline p-2 hover:bg-surface-container hover:text-primary rounded-lg transition-all cursor-pointer">
          more_vert
        </button>
      </div>

      {/* Message History */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll bg-[#F8FAFC]/30"
      >
        {messages.map((msg) => {
          const isPsych = msg.sender === "psychologist";
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 max-w-[85%] ${
                isPsych ? "" : "ml-auto flex-row-reverse"
              }`}
            >
              <div
                className={`p-4 rounded-2xl soft-bloom ${
                  isPsych
                    ? "bg-primary-fixed text-on-primary-fixed chat-bubble-psychologist"
                    : "bg-surface-container text-on-surface chat-bubble-user"
                }`}
              >
                <p className="font-body-md whitespace-pre-wrap">{msg.text}</p>
                <span
                  className={`text-[10px] mt-2 block text-right ${
                    isPsych ? "opacity-70 text-on-primary-fixed" : "text-on-surface-variant"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Psychologist Typing Indicator Bubble */}
        {isTyping && (
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="bg-primary-fixed text-on-primary-fixed p-4 rounded-2xl chat-bubble-psychologist soft-bloom flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-on-primary-fixed rounded-full animate-bounce delay-0"></span>
              <span className="w-1.5 h-1.5 bg-on-primary-fixed rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-on-primary-fixed rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-outline-variant">
        <div className={`flex items-center gap-3 bg-surface-subtle border border-outline-variant rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}>
          <button
            disabled={isDisabled}
            className={`material-symbols-outlined text-outline transition-colors cursor-pointer ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:text-primary"}`}
          >
            attach_file
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 font-body-md py-2 text-on-surface outline-none focus:outline-none disabled:cursor-not-allowed"
            placeholder={isDisabled ? "Jadwal sesi konsultasi belum dimulai..." : "Tulis pesan Anda di sini..."}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
          />
          <button
            onClick={onSend}
            disabled={isDisabled}
            className={`bg-primary text-white p-2 rounded-lg transition-all flex items-center justify-center ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-primary-container active:scale-95 cursor-pointer"}`}
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}
