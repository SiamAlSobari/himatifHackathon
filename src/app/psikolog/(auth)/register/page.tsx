import {
  ShieldCheck,
  MessageCircle,
  Lock,
  Brain,
  Zap,
  Award,
} from "lucide-react"
import Link from "next/link"
import { RegisterForm } from "./register-form"
import { StatItem } from "../types"

const features = [
  { icon: MessageCircle, label: "Platform Chat Realtime" },
  { icon: Lock, label: "Privasi Terjamin" },
  { icon: Brain, label: "Terintegrasi AI" },
  { icon: Zap, label: "Dashboard Instan" },
]

const stats: StatItem[] = [
  { value: "50+", label: "Psikolog Aktif" },
  { value: "24/7", label: "Dukungan Sistem" },
  { value: "100%", label: "Kerahasiaan Medis" },
]

export default function PsychologistRegisterPage() {
  return (
    <div className="h-screen w-screen bg-[#F0F4F8] relative flex items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/60 via-[#F0F4F8] to-violet-50/50 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[26rem] h-[26rem] bg-violet-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-white/40 backdrop-blur-md border border-white/50 rounded-[2.5rem] shadow-2xl shadow-indigo-950/5 p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-hidden">
        
        {/* Left Side: Stats & Description */}
        <aside className="hidden lg:flex lg:w-[48%] flex-col justify-between self-stretch">
          <div>
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="flex items-center gap-2.5 text-lg font-bold text-[#0D1B2A] tracking-tight"
              >
                <img src="/logo-app.png" alt="Verimind Logo" className="h-8 w-auto object-contain" />
                <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
              </Link>
              <div className="inline-flex items-center gap-1.5 bg-teal-100 border border-teal-200 rounded-full px-3 py-1">
                <Award className="h-3 w-3 text-teal-700" />
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800">
                  Join Us
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl xl:text-4xl font-bold text-[#0D1B2A] leading-[1.15]">
                Bermitra Untuk{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#1A8A7A] to-teal-500 bg-clip-text text-transparent">
                    Kemanusiaan
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
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
              </h2>
              <p className="text-xs text-[#2D3748]/70 leading-relaxed max-w-sm">
                Bergabunglah bersama puluhan psikolog profesional lainnya untuk menjangkau pasien yang membutuhkan bantuan konseling secara instan dan aman.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="my-4 space-y-2.5 max-w-sm">
            <h3 className="text-[10px] font-bold text-[#0D1B2A]/40 uppercase tracking-wider">Keunggulan Platform</h3>
            <div className="grid grid-cols-2 gap-2">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 bg-white/70 border border-teal-200/30 rounded-xl p-2.5"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100">
                    <f.icon className="h-3.5 w-3.5 text-teal-700" />
                  </div>
                  <span className="text-[10px] font-bold text-[#0D1B2A] leading-tight">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/80 border border-teal-200/40 rounded-xl p-2.5 text-center"
              >
                <div className="text-xs font-black text-teal-700 leading-none">
                  {stat.value}
                </div>
                <div className="text-[9px] text-[#2D3748]/60 uppercase tracking-wider font-bold mt-1">
                  {stat.label}
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
              className="flex items-center gap-2.5 text-base font-bold text-[#0D1B2A] tracking-tight"
            >
              <img src="/logo-app.png" alt="Verimind Logo" className="h-8 w-auto object-contain" />
              <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
            </Link>
            <div className="text-xs text-[#2D3748]/70">
              sudah bermitra?{" "}
              <Link
                href="/login"
                className="font-bold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
              >
                masuk →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-xl shadow-indigo-950/5 w-full">
            <div className="mb-5">
              <div className="hidden lg:flex justify-end mb-3">
                <Link
                  href="/login"
                  className="text-xs font-bold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
                >
                  Sudah bermitra? Masuk →
                </Link>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0D1B2A] leading-[1.1] mb-1">
                Daftar Mitra{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#1A8A7A] to-teal-500 bg-clip-text text-transparent">
                    Spesialis
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M2 6C50 2 100 1 198 4"
                      stroke="#1A8A7A"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-xs text-[#2D3748]/60 mt-2">
                Isi informasi profil profesional Anda untuk mendaftar
              </p>
            </div>

            <RegisterForm />
          </div>

          <footer className="mt-5 flex items-center justify-center gap-1.5 text-[9px] text-[#2D3748]/50">
            <ShieldCheck className="h-3 w-3" />
            <span>Verifikasi lisensi praktek psikologi dilakukan secara berkala.</span>
          </footer>
        </main>

      </div>
    </div>
  )
}
