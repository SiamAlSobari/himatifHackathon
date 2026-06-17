import React from 'react'
import Link from 'next/link'

export default function Section3() {
  return (
    <section id="validasi" className="bg-background py-20 px-6 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        {/* CTA Card */}
        <div className="bg-foreground rounded-3xl px-8 py-14 md:px-16 md:py-20 text-center relative overflow-hidden transition-colors duration-500">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#1A8A7A]/20 blur-3xl rounded-full pointer-events-none" />

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 relative z-10">
            Mulailah Mendengarkan <br />
            <span className="text-primary transition-colors duration-500">Dirimu</span> Hari Ini.
          </h2>

          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto relative z-10">
            Terkadang, memahami diri sendiri dimulai dari satu percakapan sederhana.
            Biarkan AI menemanimu melalui refleksi yang personal dan adaptif.
          </p>

          <Link
            href="/mulai"
            className="inline-flex items-center gap-2 bg-white hover:bg-primary text-foreground hover:text-white text-base font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-primary/40 group relative z-10"
          >
            Temukan dirimu
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}