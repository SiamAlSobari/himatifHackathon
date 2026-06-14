"use client"

import { Phone, Shield, ShieldCheck, Lock } from "lucide-react"

interface EmergencyContactStepProps {
  value: string
  onChange: (value: string) => void
  onNext: () => void
  onBack: () => void
  onSkip: () => void
}

export default function EmergencyContactStep({
  value,
  onChange,
  onNext,
  onBack,
  onSkip,
}: EmergencyContactStepProps) {
  const isValid = value.trim().length === 0 || value.trim().length >= 8

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white">
          <ShieldCheck className="h-4 w-4 text-rose-500" />
        </div>
        <div className="text-xs leading-relaxed text-[#2D3748]/70">
          <strong className="font-bold text-[#0D1B2A]">Untuk jaga-jaga.</strong>{" "}
          Kalau sistem deteksi kamu butuh bantuan segera, kontak ini akan kami
          hubungi. <span className="font-semibold text-[#0D1B2A]">Opsional banget.</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="kontak-darurat"
          className="flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-[#0D1B2A]"
        >
          <Phone className="h-3 w-3 text-[#1A8A7A]" />
          Nomor / nama kontak darurat
        </label>
        <div className="relative">
          <input
            id="kontak-darurat"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="cth: +62 812-xxxx atau nama ibu"
            className="h-12 w-full rounded-2xl border-2 border-black/10 bg-white px-4 text-sm text-[#0D1B2A] placeholder:text-[#2D3748]/30 transition-all focus:border-[#1A8A7A] focus:outline-none focus:ring-4 focus:ring-[#1A8A7A]/10"
          />
        </div>
        <p className="px-1 text-[11px] text-[#2D3748]/50">
          Bisa nomor telepon, nama, atau keduanya. Wajib 8+ karakter kalau diisi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 rounded-xl bg-[#F0F4F8] px-3 py-2.5 text-[11px] text-[#2D3748]/70">
          <Lock className="h-3 w-3 shrink-0 text-[#1A8A7A]" />
          <span>Hanya dipakai untuk kondisi darurat</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#F0F4F8] px-3 py-2.5 text-[11px] text-[#2D3748]/70">
          <Shield className="h-3 w-3 shrink-0 text-[#1A8A7A]" />
          <span>Enkripsi end-to-end</span>
        </div>
      </div>

      {!isValid && (
        <p className="text-[11px] font-medium text-rose-500">
          ⚠️ Minimal 8 karakter kalau mau diisi.
        </p>
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full px-3 py-2 text-sm font-semibold text-[#2D3748]/70 transition-colors hover:bg-black/5 hover:text-[#0D1B2A] cursor-pointer"
        >
          ← Kembali
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-[#2D3748]/50 underline-offset-4 transition-colors hover:text-[#0D1B2A] hover:underline cursor-pointer"
          >
            Lewati
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0D1B2A] px-6 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1A8A7A] hover:shadow-lg hover:shadow-[#1A8A7A]/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            Lanjut
            <svg
              className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5"
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
      </div>
    </div>
  )
}
