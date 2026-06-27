"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

interface ChatPreviewProps {
  mode?: "register" | "login";
}

export default function ChatPreview({ mode = "register" }: ChatPreviewProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Step 0: User Msg 1 shown immediately on mount
    
    // Step 1: AI Loading shows at 1200ms
    timers.push(setTimeout(() => setStep(1), 1200));

    // Step 2: AI Msg 1 replaces loading at 2800ms
    timers.push(setTimeout(() => setStep(2), 2800));

    // Step 3: User Loading shows at 4200ms
    timers.push(setTimeout(() => setStep(3), 4200));

    // Step 4: User Msg 2 replaces loading at 5800ms
    timers.push(setTimeout(() => setStep(4), 5800));

    // Step 5: AI Loading 2 shows at 7000ms
    timers.push(setTimeout(() => setStep(5), 7000));

    // Step 6: AI Msg 2 replaces loading at 8500ms
    timers.push(setTimeout(() => setStep(6), 8500));

    // Reset loop at 14000ms
    timers.push(setTimeout(() => {
      setStep(0);
    }, 14000));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [step === 0]);

  // Define messages based on mode
  const messages = {
    register: {
      msg1: "Kak, aku lagi stres banget sama kuliah... 🥺",
      badge1: "+50 XP",
      aiMsg1: "Paham banget, tugas numpuk ya? ☕ Coba tarik napas dulu. Mana yang paling bikin lo kepikiran?",
      msg2: "Tugas kodingan mentok mulu. Tapi habis cerita jadi mendingan sih. 💻",
      badge2: "Lega! ✓",
      aiMsg2: "Keren! Lo hebat udah bertahan. Yuk kita urai pelan-pelan bareng! 🌱",
    },
    login: {
      msg1: "Hai Very, akhir-akhir ini agak kosong aja nih... 😅",
      badge1: "Kangen",
      aiMsg1: "Dengerin aku ya 🌱 kosong itu berat, tapi lo ga sendirian. Mau spill dari mana dulu?",
      msg2: "Iya nih, untung bisa balik login dan cerita lagi ke sini. 💚",
      badge2: "Nyaman! ✓",
      aiMsg2: "Sama-sama bestie! Aku siap dengerin cerita lo sampai pagi. Spill aja semuanya ✨",
    },
  }[mode];

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-black/5 p-4 shadow-lg relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-emerald-100 shrink-0">
            <Image
              src="/mommy.jpg"
              alt="Very AI Avatar"
              fill
              className="object-cover"
              sizes="32px"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-slate-800 leading-none mb-0.5">Very AI</h4>
            <span className="text-[9px] text-[#1A8A7A] font-bold">Online sekarang</span>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1A8A7A]" />
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* Messages Window */}
      <div className="space-y-3 min-h-[260px] max-h-[300px] flex flex-col justify-end overflow-hidden pb-1">
        {/* Msg 1 (User) always shown */}
        <div className="flex justify-end animate-slide-right">
          <div className="bg-[#1A8A7A] text-white rounded-2xl rounded-br-sm px-3.5 py-2 text-xs relative max-w-[80%] shadow-sm">
            <p className="leading-relaxed">{messages.msg1}</p>
            <div className="absolute -top-2.5 -right-1 bg-white text-[#1A8A7A] px-1.5 py-0.5 rounded-full text-[8px] font-black border border-emerald-100 shadow-sm flex items-center gap-0.5">
              {messages.badge1}
            </div>
          </div>
        </div>

        {/* AI Loading or AI Msg 1 */}
        {step === 1 && (
          <div className="flex items-center gap-1 bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70px] animate-fade-in">
            <span className="w-1.5 h-1.5 bg-[#1A8A7A] rounded-full animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 bg-[#1A8A7A] rounded-full animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 bg-[#1A8A7A] rounded-full animate-bounce delay-300" />
          </div>
        )}

        {step >= 2 && (
          <div className="flex items-start gap-2 animate-slide-left">
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-emerald-100 shrink-0">
              <Image src="/mommy.jpg" alt="Very AI" fill className="object-cover" sizes="24px" />
            </div>
            <div className="bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs max-w-[80%] text-slate-800 shadow-sm">
              <div className="text-[9px] text-[#1A8A7A] font-bold mb-0.5 flex items-center gap-1">
                <Sparkles className="h-2 w-2 fill-[#1A8A7A] text-[#1A8A7A]" /> Very AI
              </div>
              <p className="leading-relaxed">{messages.aiMsg1}</p>
            </div>
          </div>
        )}

        {/* User Loading or User Msg 2 */}
        {step === 3 && (
          <div className="flex items-center gap-1 bg-[#1A8A7A] rounded-2xl rounded-br-sm px-3 py-2 max-w-[70px] ml-auto animate-fade-in">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300" />
          </div>
        )}

        {step >= 4 && (
          <div className="flex justify-end animate-slide-right">
            <div className="bg-[#1A8A7A] text-white rounded-2xl rounded-br-sm px-3.5 py-2 text-xs relative max-w-[80%] shadow-sm">
              <p className="leading-relaxed">{messages.msg2}</p>
              <div className="absolute -left-12 bottom-1 bg-white text-[#1A8A7A] px-1.5 py-0.5 rounded-full text-[8px] font-black border border-emerald-100 shadow-sm">
                {messages.badge2}
              </div>
            </div>
          </div>
        )}

        {/* AI Loading 2 or AI Msg 2 */}
        {step === 5 && (
          <div className="flex items-center gap-1 bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70px] animate-fade-in">
            <span className="w-1.5 h-1.5 bg-[#1A8A7A] rounded-full animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 bg-[#1A8A7A] rounded-full animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 bg-[#1A8A7A] rounded-full animate-bounce delay-300" />
          </div>
        )}

        {step >= 6 && (
          <div className="flex items-start gap-2 animate-slide-left">
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-emerald-100 shrink-0">
              <Image src="/mommy.jpg" alt="Very AI" fill className="object-cover" sizes="24px" />
            </div>
            <div className="bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs max-w-[80%] text-slate-800 shadow-sm">
              <div className="text-[9px] text-[#1A8A7A] font-bold mb-0.5 flex items-center gap-1">
                <Sparkles className="h-2 w-2 fill-[#1A8A7A] text-[#1A8A7A]" /> Very AI
              </div>
              <p className="leading-relaxed">{messages.aiMsg2}</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Placeholder */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 text-[10px] text-slate-450 flex items-center justify-between mt-3">
        <span>Tanya Very apa aja...</span>
        <button className="h-7 w-7 rounded-full bg-[#1A8A7A] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer">
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
