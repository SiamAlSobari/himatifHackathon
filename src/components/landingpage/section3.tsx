"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function Section3() {
  return (
    <section id="validasi" className="bg-background py-24 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* CTA Card */}
        <div className="bg-foreground rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center relative overflow-hidden shadow-premium scroll-reveal">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#1A8A7A]/20 blur-3xl rounded-full pointer-events-none" />

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 relative z-10">
            Mulailah Mendengarkan <br />
            <span className="text-primary transition-colors duration-500">Dirimu</span> Hari Ini.
          </h2>

          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto relative z-10">
            Pahami dirimu lebih dekat lewat refleksi harian. Lakukan skrining awal secara mandiri atau langsung jadwalkan sesi bersama mitra psikolog kami.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white hover:bg-primary text-foreground hover:text-white text-base font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-primary/40 hover-lift hover-glow group relative z-10"
          >
            Mulai Konsultasi
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Disclaimer Banner */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm flex items-start gap-4 scroll-reveal">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-amber-800">
              Peringatan & Batasan Layanan (Disclaimer)
            </h4>
            <p className="text-xs text-amber-700/90 leading-relaxed font-medium">
              Very AI bisa salah dalam melakukan asesmen dan tidak bertujuan menggantikan diagnosis medis klinis, psikolog, psikiater, maupun tindakan penanganan krisis. Jika Anda berada dalam situasi darurat atau memiliki dorongan untuk membahayakan diri sendiri, harap segera menghubungi psikolog berlisensi kami atau hotline darurat medis terdekat.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}