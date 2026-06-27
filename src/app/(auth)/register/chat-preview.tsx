"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ChatPreview() {
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

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-black/5 p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden border border-emerald-100 shrink-0">
            <Image
              src="/mommy.jpg"
              alt="Very AI Avatar"
              fill
              className="object-cover"
              sizes="40px"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 leading-none mb-1">Very AI</h4>
            <span className="text-[10px] text-emerald-600 font-semibold">Online sekarang</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
        </div>
      </div>

      {/* Messages Window */}
      <div className="space-y-4 min-h-[360px] flex flex-col justify-end">
        {/* Msg 1 (User) always shown */}
        <div className="flex justify-end animate-fade-in duration-300">
          <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-xs relative max-w-[80%] shadow-md">
            <p className="leading-relaxed">Kak, aku lagi stres banget sama kuliah... 🥺</p>
            <div className="absolute -top-3 -right-2 bg-white text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-black border border-rose-100 shadow-sm flex items-center gap-0.5">
              <Sparkles className="h-2 w-2 text-rose-500 fill-rose-500" /> +50 XP
            </div>
          </div>
        </div>

        {/* AI Loading or AI Msg 1 */}
        {step === 1 && (
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80px] animate-fade-in">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300" />
          </div>
        )}

        {step >= 2 && (
          <div className="flex items-start gap-2.5 animate-fade-in duration-300">
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-emerald-100 shrink-0">
              <Image src="/mommy.jpg" alt="Very AI" fill className="object-cover" sizes="24px" />
            </div>
            <div className="bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm p-4 text-xs max-w-[80%] text-slate-800 shadow-sm">
              <div className="text-[10px] text-emerald-600 font-bold mb-1 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 fill-emerald-500" /> Very AI
              </div>
              <p className="leading-relaxed">Paham banget, tugas numpuk ya? ☕ Coba tarik napas dulu. Dari semua tugas, mana yang paling bikin lo kepikiran sekarang?</p>
            </div>
          </div>
        )}

        {/* User Loading or User Msg 2 */}
        {step === 3 && (
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-400 to-rose-400 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80px] ml-auto animate-fade-in">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-300" />
          </div>
        )}

        {step >= 4 && (
          <div className="flex justify-end animate-fade-in duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-xs relative max-w-[80%] shadow-md">
              <p className="leading-relaxed">Iya nih, tugas kodingan mentok mulu dari kemarin. Tapi habis cerita jadi mendingan sih. 💻</p>
              <div className="absolute -left-16 bottom-1 bg-white text-[#1A8A7A] px-2 py-0.5 rounded-full text-[9px] font-black border border-emerald-100 shadow-sm">
                Lega! ✓
              </div>
            </div>
          </div>
        )}

        {/* AI Loading 2 or AI Msg 2 */}
        {step === 5 && (
          <div className="flex items-center gap-1.5 bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80px] animate-fade-in">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150" />
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300" />
          </div>
        )}

        {step >= 6 && (
          <div className="flex items-start gap-2.5 animate-fade-in duration-300">
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-emerald-100 shrink-0">
              <Image src="/mommy.jpg" alt="Very AI" fill className="object-cover" sizes="24px" />
            </div>
            <div className="bg-[#FAF9F6] border border-emerald-100 rounded-2xl rounded-bl-sm p-4 text-xs max-w-[80%] text-slate-800 shadow-sm">
              <div className="text-[10px] text-emerald-600 font-bold mb-1 flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 fill-emerald-500" /> Very AI
              </div>
              <p className="leading-relaxed">Mantap! Lo udah hebat banget mau bertahan. Yuk kita urai pelan-pelan bareng-bareng! 🌱</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Placeholder */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4 text-xs text-slate-400 flex items-center justify-between mt-4">
        <span>Tanya Very apa aja...</span>
        <button className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
