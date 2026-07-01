"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Section1 from "@/components/landingpage/section1";
import Section2 from "@/components/landingpage/section2";
import Section3 from "@/components/landingpage/section3";
import { AppTheme } from "@/lib/types/theme";
import { animate } from "animejs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

const THEMES: AppTheme[] = ["calm_blue", "warm_yellow", "alert_orange", "deep_purple"];

export default function LandingClient() {
  const router = useRouter();
  const [localTheme, setLocalTheme] = useState<AppTheme>("calm_blue");
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDisclaimerOpen(true);
  };

  const handleAcceptDisclaimer = () => {
    setIsDisclaimerOpen(false);
    router.push("/dashboard");
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Apply initial local theme to document root
    const root = document.documentElement;
    root.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        root.classList.remove(cls);
      }
    });
    root.classList.add(`theme-${localTheme}`);

    // Cycle local theme every 2.5 seconds
    const interval = setInterval(() => {
      setLocalTheme((prev) => {
        const nextIndex = (THEMES.indexOf(prev) + 1) % THEMES.length;
        const nextTheme = THEMES[nextIndex];

        // Apply dynamically to document class list without writing to cookies or session
        const docRoot = document.documentElement;
        docRoot.classList.forEach((cls) => {
          if (cls.startsWith("theme-")) {
            docRoot.classList.remove(cls);
          }
        });
        docRoot.classList.add(`theme-${nextTheme}`);

        return nextTheme;
      });
    }, 2500);

    return () => {
      clearInterval(interval);
      // Restore the user's persistent global theme on unmount
      const docRoot = document.documentElement;
      docRoot.classList.forEach((cls) => {
        if (cls.startsWith("theme-")) {
          docRoot.classList.remove(cls);
        }
      });
      const savedTheme = window.sessionStorage.getItem("app-theme") || "calm_blue";
      docRoot.classList.add(`theme-${savedTheme}`);
    };
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            animate(entry.target, {
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 1000,
              easing: "easeOutCubic"
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const timer = setTimeout(() => {
      const targets = document.querySelectorAll(".scroll-reveal");
      targets.forEach((el) => {
        ;(el as HTMLElement).style.opacity = "0";
        ;(el as HTMLElement).style.transform = "translateY(40px)";
        observer.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleSelectTheme = (t: AppTheme) => {
    setLocalTheme(t);
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.forEach((cls) => {
        if (cls.startsWith("theme-")) {
          root.classList.remove(cls);
        }
      });
      root.classList.add(`theme-${t}`);
    }
  };

  return (
    <main className="relative">
      {/* Floating Demo Mood selector widget */}
      <div className="fixed bottom-6 left-6 z-40 bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-2xl p-4 shadow-xl max-w-[280px] transition-all duration-300 hover:shadow-2xl hidden md:block">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-wide">Demo: Adaptasi Emosi</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal mb-3">
          Warna, tombol, dan font platform ini berubah menyesuaikan kondisi emosional hasil screening & respon chat AI.
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {THEMES.map((t) => {
            const isActive = localTheme === t;
            return (
              <button
                key={t}
                onClick={() => handleSelectTheme(t)}
                className={`px-2 py-1.5 rounded-lg text-[9px] font-bold tracking-wider transition-all text-center border uppercase cursor-pointer ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm scale-[1.03]"
                    : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            );
          })}
        </div>
      </div>

      <Section1 onCtaClick={handleCtaClick} />
      <Section2 />
      <Section3 onCtaClick={handleCtaClick} />

      <Dialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] bg-white rounded-3xl border border-slate-100 shadow-premium p-6 outline-none">
          <DialogHeader className="flex flex-row items-center gap-4 border-b border-slate-50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Persetujuan & Batasan Layanan
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 text-sm text-slate-600 leading-relaxed space-y-3 font-medium">
            <p>
              Sebelum melanjutkan perjalanan refleksi Anda bersama kami, mohon pahami bahwa:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>
                <strong className="text-slate-700">Very AI bisa salah</strong> dalam melakukan analisis awal atau asesmen emosi Anda.
              </li>
              <li>
                Platform ini <strong className="text-slate-700">tidak bertujuan menggantikan</strong> diagnosis medis klinis, psikolog, psikiater, maupun tindakan penanganan krisis darurat.
              </li>
              <li>
                Jika Anda berada dalam situasi darurat atau memiliki dorongan membahayakan diri sendiri, harap segera menghubungi hotline darurat medis atau psikolog profesional berlisensi terdekat.
              </li>
            </ul>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-50">
            <button
              onClick={() => setIsDisclaimerOpen(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all duration-200 cursor-pointer"
            >
              Batalkan
            </button>
            <button
              onClick={handleAcceptDisclaimer}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white text-xs font-bold shadow-md hover:shadow-primary/30 transition-all duration-200 hover-lift cursor-pointer"
            >
              Saya Mengerti & Setuju
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
