"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Section3Props {
  onCtaClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Section3({ onCtaClick }: Section3Props) {
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
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 bg-white hover:bg-primary text-foreground hover:text-white text-base font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-primary/40 hover-lift hover-glow group relative z-10"
          >
            Mulai Konsultasi
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}