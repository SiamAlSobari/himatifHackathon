"use client";

import React, { useEffect, useState } from "react";
import Section1 from "@/components/landingpage/section1";
import Section2 from "@/components/landingpage/section2";
import Section3 from "@/components/landingpage/section3";
import { AppTheme } from "@/lib/types/theme";
import { animate } from "animejs";

const THEMES: AppTheme[] = ["calm_blue", "warm_yellow", "alert_orange", "deep_purple"];

export default function LandingClient() {
  const [localTheme, setLocalTheme] = useState<AppTheme>("calm_blue");

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

      <Section1 />
      <Section2 />
      <Section3 />
    </main>
  );
}
