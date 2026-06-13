import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Section1() {
  return (
    <section id="hero" className="relative h-screen bg-[#F0F4F8] flex flex-col overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-w-125 h-w-125 bg-[#1A8A7A]/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#0D1B2A]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Hero Content — proporsi 45% layar */}
      <div
        className="flex flex-col items-center justify-end text-center px-6 pb-6 pt-24 max-w-4xl mx-auto w-full"
        style={{ height: '45%' }}
      >

        {/* Headline */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#0D1B2A] leading-tight mb-3">
          Dengarkan{' '}
          <span className="text-[#1A8A7A] relative">
            Dirimu
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C50 2 100 1 198 4"
                stroke="#1A8A7A"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="text-lg md:text-xl font-medium text-[#0D1B2A] mb-2">
          Satu Percakapan Bisa Mengubah Banyak Hal.
        </p>

        <p className="text-sm md:text-base text-[#2D3748]/70 max-w-xl mb-6 leading-relaxed">
          AI akan menyesuaikan setiap pertanyaan berdasarkan jawabanmu,
          sehingga proses refleksi terasa lebih alami dan bermakna.
        </p>

        {/* CTA */}
        <Link
          href="/mulai"
          className="inline-flex items-center gap-2 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white text-sm font-medium px-7 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#1A8A7A]/30 hover:shadow-xl group"
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

      {/* Hero Image Container — proporsi 55% layar */}
      <div className="w-full max-w-5xl mx-auto px-6 pb-0" style={{ height: '55%' }}>
        <div className="relative w-full h-full rounded-t-2xl overflow-hidden bg-[#D1D9E0]">
          <Image
            src="/tuttopasa.jpeg"
            alt="Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay bawah */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-[#F0F4F8] to-transparent" />
        </div>
      </div>
    </section>
  )
}