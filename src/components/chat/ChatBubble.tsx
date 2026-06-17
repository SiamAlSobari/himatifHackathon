import Image from "next/image";
import { Sparkles } from "lucide-react";

interface ChatBubbleProps {
  sender: "ai" | "user";
  message: string;
  time: string;
  isTyping?: boolean;
}

export default function ChatBubble({
  sender,
  message,
  time,
  isTyping = false,
}: ChatBubbleProps) {
  const isAi = sender === "ai";

  return (
    <div
      className={`flex items-start gap-3 ${
        isAi ? "justify-start" : "justify-end"
      }`}
    >
      {isAi && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-transform hover:scale-105">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
          isAi
            ? "bg-primary text-white rounded-tl-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-tr-sm"
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-2.5 py-1.5 px-1">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-white" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs font-medium text-white/80 animate-pulse">
              Lombut AI sedang berpikir...
            </span>
          </div>
        ) : (
          <p className="whitespace-pre-line">{message}</p>
        )}
        
        {!isTyping && (
          <p
            className={`mt-1.5 text-right text-[10px] font-medium tracking-wide ${
              isAi ? "text-white/70" : "text-slate-400"
            }`}
          >
            {time}
          </p>
        )}
      </div>

      {!isAi && (
        <Image
          src="https://i.pravatar.cc/40?img=12"
          alt="Foto profil pengguna"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover border border-slate-200 shadow-sm transition-transform hover:scale-105"
        />
      )}
    </div>
  );
}