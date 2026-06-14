"use client"

import { Sparkles, Shield, Heart } from "lucide-react"

interface WelcomeStepProps {
  userName?: string | null
  onNext: () => void
}

export default function WelcomeStep({ userName, onNext }: WelcomeStepProps) {
  const name = userName?.split(" ")[0] ?? "teman"

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A8A7A] to-[#0D1B2A] shadow-lg shadow-[#1A8A7A]/20">
          <Sparkles className="h-7 w-7 text-white" />
        </div>

        <h2 className="font-serif text-3xl font-bold leading-tight text-[#0D1B2A] md:text-4xl">
          Halo, <span className="text-[#1A8A7A]">{name}</span> 👋
        </h2>

        <p className="mx-auto max-w-sm text-sm leading-relaxed text-[#2D3748]/70">
          Sebelum kita mulai ngobrol, aku mau kenalan dulu sama kamu. Cuma 5
          pertanyaan ringan, <strong className="font-bold text-[#0D1B2A]">± 60 detik</strong> aja.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#1A8A7A]/20 bg-white p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A8A7A]/10">
            <Heart className="h-4 w-4 text-[#1A8A7A]" />
          </div>
          <p className="text-sm font-bold text-[#0D1B2A]">Personal</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#2D3748]/60">
            Jawaban kamu bikin AI lebih ngerti kamu.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0F4F8]">
            <Shield className="h-4 w-4 text-[#0D1B2A]" />
          </div>
          <p className="text-sm font-bold text-[#0D1B2A]">Privat</p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#2D3748]/60">
            Data kamu dienkripsi &amp; cuma kamu yang bisa akses.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#0D1B2A]/5 px-4 py-3 text-[11px] font-medium text-[#2D3748]/70">
        <span className="flex h-1.5 w-1.5 rounded-full bg-[#1A8A7A]" />
        Bisa diubah kapan saja di pengaturan profil
      </div>

      <button
        type="button"
        onClick={onNext}
        className="group/cta mx-auto flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1A8A7A] hover:shadow-xl hover:shadow-[#1A8A7A]/30 cursor-pointer"
      >
        Ayo Mulai Kenalan
        <svg
          className="h-4 w-4 transition-transform group-hover/cta:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  )
}
