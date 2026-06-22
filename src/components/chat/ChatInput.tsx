"use client";

import { useState } from "react";
import { Plus, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  activeTheme?: string;
}

const buttonColorMap = {
  calm_blue: "bg-teal-800 hover:bg-teal-700",
  warm_yellow: "bg-amber-800 hover:bg-amber-700",
  alert_orange: "bg-orange-800 hover:bg-orange-700",
  deep_purple: "bg-indigo-800 hover:bg-indigo-700",
};

export default function ChatInput({ onSend, disabled, activeTheme = "calm_blue" }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const buttonColor = buttonColorMap[activeTheme as keyof typeof buttonColorMap] || "bg-teal-800 hover:bg-teal-700";

  return (
    <div className="border-t border-slate-200 px-6 py-4">
      <div className={`flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 ${disabled ? "opacity-60 bg-slate-50" : ""}`}>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Sesi chat dinonaktifkan..." : "Ketik pesan Anda di sini..."}
          className={`flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none ${disabled ? "cursor-not-allowed" : ""}`}
        />

        <button
          type="button"
          aria-label="Kirim pesan"
          disabled={disabled}
          onClick={handleSend}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors ${disabled ? "bg-slate-300 cursor-not-allowed" : buttonColor}`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        Percakapan ini dienkripsi dan rahasia.
      </p>
    </div>
  );
}