import { Bot, MoreVertical } from "lucide-react";

export default function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-900 text-white">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">LOMBUT AI</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Online</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Opsi lainnya"
        className="text-slate-400 hover:text-slate-600"
      >
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}