"use client";

import React, { useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "psychologist" | "user";
  text: string;
  time: string;
}

interface PsychologistChatAreaProps {
  clientName: string;
  clientImage: string;
  isTyping: boolean;
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
}

export default function PsychologistChatArea({
  clientName,
  clientImage,
  isTyping,
  messages,
  inputValue,
  setInputValue,
  onSend,
}: PsychologistChatAreaProps) {
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
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
              alt={clientName}
              src={clientImage}
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${isTyping ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
          </div>
          <div>
            <h2 className="font-headline-md text-body-lg font-bold text-primary">{clientName}</h2>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isTyping ? "text-amber-600" : "text-green-600"}`}>
                {isTyping ? "Klien Mengetik..." : "Online"}
              </span>
            </div>
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
                isPsych ? "ml-auto flex-row-reverse" : ""
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
                    isPsych ? "text-on-primary-fixed/70" : "text-on-surface-variant"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {/* Client Typing Indicator Bubble */}
        {isTyping && (
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="bg-surface-container text-on-surface p-4 rounded-2xl chat-bubble-user soft-bloom flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-on-surface rounded-full animate-bounce delay-0"></span>
              <span className="w-1.5 h-1.5 bg-on-surface rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-on-surface rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-outline-variant">
        <div className="flex items-center gap-3 bg-surface-subtle border border-outline-variant rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <button className="material-symbols-outlined text-outline hover:text-primary transition-colors cursor-pointer">
            attach_file
          </button>
          <input
            className="flex-1 bg-transparent border-none focus:ring-0 font-body-md py-2 text-on-surface outline-none focus:outline-none"
            placeholder="Tulis pesan Anda sebagai psikolog di sini..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={onSend}
            className="bg-primary hover:bg-primary-container text-white p-2 rounded-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}
