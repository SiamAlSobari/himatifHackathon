"use client";

import { useState } from "react";
import { Plus, Mic, Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2">
        <button
          type="button"
          aria-label="Tambah lampiran"
          className="text-slate-400 hover:text-slate-600"
        >
          <Plus className="h-5 w-5" />
        </button>

        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda di sini..."
          className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />

        <button
          type="button"
          aria-label="Rekam suara"
          className="text-slate-400 hover:text-slate-600"
        >
          <Mic className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Kirim pesan"
          onClick={handleSend}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-800 text-white transition-colors hover:bg-teal-700"
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