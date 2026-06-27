import React from "react";

interface ConfirmEndSessionModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onDecline: () => void;
  isConfirming?: boolean;
  isDeclining?: boolean;
  confirmLabel?: string;
  declineLabel?: string;
}

export default function ConfirmEndSessionModal({
  isOpen,
  title,
  message,
  onConfirm,
  onDecline,
  isConfirming = false,
  isDeclining = false,
  confirmLabel = "Ya, Setujui",
  declineLabel = "Tidak",
}: ConfirmEndSessionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in duration-300">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-sm w-full p-6 animate-scale-in duration-300">
        {/* Icon Header */}
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-rose-600 text-2xl">
            chat_bubble_error
          </span>
        </div>

        {/* Title & Message */}
        <h3 className="text-base font-bold text-slate-900 leading-tight mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            disabled={isDeclining || isConfirming}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
          >
            {isDeclining ? "Memproses..." : declineLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming || isDeclining}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-center shadow-md flex items-center justify-center gap-2"
          >
            {isConfirming ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
