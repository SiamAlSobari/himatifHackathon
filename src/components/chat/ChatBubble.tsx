import Image from "next/image";
import { Bot } from "lucide-react";

interface ChatBubbleProps {
  sender: "ai" | "user";
  message: string;
  time: string;
}

export default function ChatBubble({ sender, message, time }: ChatBubbleProps) {
  const isAi = sender === "ai";

  return (
    <div
      className={`flex items-end gap-2 ${
        isAi ? "justify-start" : "justify-end"
      }`}
    >
      {isAi && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-900 text-white">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAi
            ? "bg-teal-800 text-white"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        <p className="whitespace-pre-line">{message}</p>
        <p
          className={`mt-1.5 text-right text-[11px] ${
            isAi ? "text-teal-200/80" : "text-slate-400"
          }`}
        >
          {time}
        </p>
      </div>

      {!isAi && (
        <Image
          src="https://i.pravatar.cc/40?img=12"
          alt="Foto profil pengguna"
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full object-cover"
        />
      )}
    </div>
  );
}