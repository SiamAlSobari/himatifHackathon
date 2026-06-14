import { UserPlus, Sparkles } from "lucide-react"
import { RegisterForm } from "./register-form"

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-3xl p-7 md:p-8 border border-black/5 shadow-2xl shadow-[#0D1B2A]/10 space-y-5 relative overflow-visible">
      <div className="absolute -top-2.5 -right-2.5 bg-[#C4B5FD] text-[#0D1B2A] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full -rotate-6 shadow-lg border-2 border-white z-10 flex items-center gap-1">
        <Sparkles className="h-2.5 w-2.5" />
        gas gabung
      </div>

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1A8A7A] via-[#FFD700] to-[#C4B5FD] rounded-t-3xl" />

      <div className="text-center space-y-2.5">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A8A7A]/20 to-[#1A8A7A]/5 mb-1">
          <UserPlus className="h-5 w-5 text-[#1A8A7A]" strokeWidth={2.5} />
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0D1B2A] leading-tight">
          yok daftar ke{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-[#1A8A7A] to-emerald-500 bg-clip-text text-transparent">
              Ruang
            </span>
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C50 2 100 1 198 4"
                stroke="#1A8A7A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          🌱
        </h1>
        <p className="text-xs md:text-sm text-[#2D3748]/70 max-w-xs mx-auto leading-relaxed">
          gratis, 30 detik, no ribet. yuk mulai sekarang ✨
        </p>
      </div>

      <RegisterForm />
    </div>
  )
}
