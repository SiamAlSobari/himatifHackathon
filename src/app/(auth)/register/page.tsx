import {
  ShieldCheck,
  Users,
  MessageCircle,
  Lock,
  Brain,
  Zap,
  Sparkles,
  Star,
  Heart,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RegisterForm } from "./register-form"

const features = [
  { icon: MessageCircle, label: "AI 24/7" },
  { icon: Lock, label: "Privat" },
  { icon: Brain, label: "Adaptif" },
  { icon: Zap, label: "Personal" },
]

const stats = [
  { value: "4.9", suffix: "★", label: "rating" },
  { value: "1.2k+", label: "cerita" },
  { value: "100%", label: "aman" },
]

export default function RegisterPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#F0F4F8] relative flex flex-col lg:flex-row">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 via-[#F0F4F8] to-violet-50/50" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[26rem] h-[26rem] bg-violet-200/25 rounded-full blur-3xl" />

      <aside className="hidden lg:flex relative z-10 lg:w-[48%] flex-col p-7 xl:p-9 h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <Link
            href="/"
            className="text-lg font-bold text-[#0D1B2A] tracking-tight"
          >
            Jembatan <span className="text-[#1A8A7A]">Aman</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 rounded-full px-2.5 py-1">
            <Sparkles className="h-3 w-3 text-emerald-700" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              fresh start
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-0 gap-3.5">
          <div>
            <h2 className="font-serif text-3xl xl:text-4xl font-bold text-[#0D1B2A] leading-[1.05] mb-2.5">
              yuk kenal{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#1A8A7A] to-emerald-500 bg-clip-text text-transparent">
                  dirimu
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
            <p className="text-sm text-[#2D3748]/70 leading-relaxed max-w-md">
              30 detik, gratis, no ribet. mulai perjalanan refleksi emosional lo
              hari ini.
            </p>
          </div>

          <div className="flex items-center gap-3 max-w-md">
            <div className="relative w-28 h-24 shrink-0">
              <div className="relative w-full h-full bg-gradient-to-br from-[#F0F4F8] to-[#E2E8F0] rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                <Image
                  src="/mommy.jpg"
                  alt="LOMBUT AI"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="112px"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 rounded-tl-xl" />
              </div>
              <div className="absolute -top-1.5 -left-1.5 bg-white/95 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 shadow-md border border-emerald-200">
                <Heart className="h-2 w-2 text-rose-500 fill-rose-500" />
                <span className="text-[8px] font-black uppercase tracking-wider">
                  bestie
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700]"
                  />
                ))}
                <span className="text-[10px] font-black text-[#0D1B2A] ml-1">
                  4.9
                </span>
              </div>
              <p className="text-[10px] text-[#2D3748]/60 italic leading-snug">
                &ldquo;ngobrol sama LOMBUT berasa kayak bestie. jadi lebih
                ngerti perasaan sendiri ✨&rdquo;
              </p>
            </div>
          </div>

          <div className="space-y-2 max-w-md">
            <div className="flex items-start gap-2">
              <div className="h-7 w-7 rounded-full overflow-hidden border-2 border-emerald-300 relative shrink-0">
                <Image
                  src="/mommy.jpg"
                  alt="LOMBUT"
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
              <div className="bg-white border border-emerald-200/60 rounded-2xl rounded-bl-md px-3.5 py-2 shadow-sm flex-1">
                <p className="text-xs text-[#0D1B2A]/80 leading-relaxed">
                  welcome bestie 🌱 aku LOMBUT, temen ngobrol lo. cerita aja, ga
                  ada yang ngehakimin di sini ✨
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#1A8A7A] text-white rounded-2xl rounded-br-md px-3.5 py-2 shadow-sm max-w-[80%]">
                <p className="text-xs leading-relaxed">
                  makasih LOMBUT! yuk mulai ✨
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-w-md">
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/80 border border-emerald-200/60 rounded-xl p-2.5 text-center"
                >
                  <div className="text-base font-black text-emerald-700 leading-none">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-xs text-[#FFD700] ml-0.5">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <div className="text-[8px] text-[#2D3748]/60 uppercase tracking-wider font-bold mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="inline-flex items-center gap-1 bg-white border border-emerald-200 rounded-full pl-1.5 pr-2.5 py-1"
                >
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
                    <f.icon className="h-2 w-2 text-emerald-700" />
                  </div>
                  <span className="text-[10px] font-bold text-[#0D1B2A]">
                    {f.label}
                  </span>
                </div>
              ))}
              <div className="inline-flex items-center gap-1 bg-[#0D1B2A] text-white rounded-full pl-1.5 pr-2.5 py-1">
                <Sparkles className="h-2 w-2 text-[#FFD700]" />
                <span className="text-[10px] font-bold">free trial</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] text-[#2D3748]/50 pt-3 mt-2 border-t border-dashed border-[#0D1B2A]/10 shrink-0">
          <ShieldCheck className="h-2.5 w-2.5" />
          <span>
            bukan pengganti profesional. buat darurat hubungi hotline.
          </span>
        </div>
      </aside>

      <main className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        <nav className="lg:hidden flex items-center justify-between px-6 py-4 shrink-0">
          <Link
            href="/"
            className="text-base font-bold text-[#0D1B2A] tracking-tight"
          >
            Jembatan <span className="text-[#1A8A7A]">Aman</span>
          </Link>
          <div className="text-xs text-[#2D3748]/70">
            udah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
            >
              masuk →
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 min-h-0">
          <div className="w-full max-w-md">
            <div className="lg:hidden inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 rounded-full px-2.5 py-1 mb-3">
              <Sparkles className="h-3 w-3 text-emerald-700" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                fresh start
              </span>
            </div>

            <div className="bg-white rounded-3xl p-7 md:p-8 border border-black/5 shadow-xl shadow-[#0D1B2A]/5">
              <div className="mb-5">
                <h1 className="font-serif text-3xl md:text-[2rem] font-bold text-[#0D1B2A] leading-[1.1] mb-1.5">
                  yok mulai di{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#1A8A7A] to-emerald-500 bg-clip-text text-transparent">
                      Ruang
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
                </h1>
                <p className="text-xs text-[#2D3748]/60">
                  gratis, 30 detik, no ribet ✨
                </p>
              </div>

              <RegisterForm />
            </div>
          </div>
        </div>

        <footer className="px-6 py-4 shrink-0">
          <div className="flex items-center justify-center gap-2 text-[10px] text-[#2D3748]/70">
            <div className="flex -space-x-1.5">
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white" />
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white" />
              <div className="h-4 w-4 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white" />
            </div>
            <Users className="h-2.5 w-2.5 text-emerald-700" />
            <span>
              <span className="font-bold text-[#0D1B2A]">1,200+</span> yang
              udah mulai spill
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
