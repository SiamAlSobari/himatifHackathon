import { Award, ShieldCheck, Star } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "./login-form"
import { StatItem } from "../types"

const stats: StatItem[] = [
  { value: "50+", label: "Mitra Psikolog" },
  { value: "4.9★", label: "Rating Layanan" },
  { value: "10k+", label: "Konsultasi Selesai" },
]

export default function PsychologistLoginPage() {
  return (
    <div className="h-screen w-screen bg-[#F0F4F8] relative flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-[#F0F4F8] to-indigo-50/50 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white/40 backdrop-blur-md border border-white/50 rounded-[2.5rem] shadow-2xl shadow-indigo-950/5 p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-hidden">
        
        {/* Left Side: Stats & Description */}
        <aside className="hidden lg:flex lg:w-[48%] flex-col justify-between self-stretch">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="text-lg font-bold text-[#0D1B2A] tracking-tight"
              >
                Jembatan <span className="text-[#1A8A7A]">Aman</span>
              </Link>
              <div className="inline-flex items-center gap-1.5 bg-teal-100 border border-teal-200 rounded-full px-3 py-1">
                <Award className="h-3 w-3 text-teal-700 fill-teal-100" />
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">
                  Professional Portal
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl xl:text-4xl font-bold text-[#0D1B2A] leading-[1.15]">
                Membantu Merekonstruksi{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#1A8A7A] to-indigo-500 bg-clip-text text-transparent">
                    Kesejahteraan Mental
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 120 8"
                    fill="none"
                  >
                    <path
                      d="M2 6C30 2 60 1 118 4"
                      stroke="#1A8A7A"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                ✨
              </h2>
              <p className="text-xs text-[#2D3748]/70 leading-relaxed max-w-sm">
                Mari bersama-sama memberikan ruang aman dan bimbingan profesional untuk membantu mereka mengatasi kecemasan dan tantangan hidup.
              </p>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="bg-white/80 border border-black/5 rounded-2xl p-4 my-4">
            <div className="flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 flex items-center justify-center text-xs shrink-0 shadow-sm">
                🌿
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-[#0D1B2A]/80 leading-relaxed italic mb-1.5">
                  &ldquo;Terima kasih atas bimbingannya hari ini, sangat membantu saya mengurai cemas. Sesi konseling di platform ini sangat terstruktur.&rdquo;
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2 w-2 fill-[#FFD700] text-[#FFD700]"
                    />
                  ))}
                  <span className="text-[9px] font-bold text-[#0D1B2A] ml-1">Klien Terbantu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/80 border border-teal-200/40 rounded-xl p-2.5 text-center"
              >
                <div className="text-xs font-black text-[#0D1B2A] leading-none">
                  {s.value}
                </div>
                <div className="text-[9px] text-[#2D3748]/60 uppercase tracking-wider font-bold mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Side: Form Card */}
        <main className="w-full lg:w-[48%] max-h-full overflow-y-auto pr-1 flex flex-col justify-center my-auto">
          {/* Header Mobile Nav */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Link
              href="/"
              className="text-base font-bold text-[#0D1B2A] tracking-tight"
            >
              Jembatan <span className="text-[#1A8A7A]">Aman</span>
            </Link>
            <div className="text-xs text-[#2D3748]/70">
              belum bermitra?{" "}
              <Link
                href="/psikolog/register"
                className="font-bold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
              >
                daftar →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-xl shadow-indigo-950/5 w-full">
            <div className="mb-5">
              <div className="hidden lg:flex justify-end mb-3">
                <Link
                  href="/psikolog/register"
                  className="text-xs font-bold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
                >
                  Belum bermitra? Daftar →
                </Link>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0D1B2A] leading-[1.1] mb-1">
                Portal{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#1A8A7A] to-indigo-50 bg-clip-text text-transparent">
                    Spesialis
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 120 8"
                    fill="none"
                  >
                    <path
                      d="M2 6C30 2 60 1 118 4"
                      stroke="#1A8A7A"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-xs text-[#2D3748]/60 mt-2">
                Silakan masuk untuk mengelola sesi konsultasi Anda
              </p>
            </div>

            <LoginForm />
          </div>

          <footer className="mt-5 flex items-center justify-center gap-1.5 text-[9px] text-[#2D3748]/50">
            <ShieldCheck className="h-3 w-3" />
            <span>Portal khusus psikolog terdaftar Jembatan Aman.</span>
          </footer>
        </main>

      </div>
    </div>
  )
}
