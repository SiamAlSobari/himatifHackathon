import {
  Heart,
  Users,
  ShieldCheck,
  Star,
} from "lucide-react"
import Link from "next/link"
import { LoginForm } from "./login-form"

const stats = [
  { value: "1.2k+", label: "cerita" },
  { value: "4.9★", label: "rating" },
  { value: "24/7", label: "online" },
]

export default function LoginPage() {
  return (
    <div className="h-screen overflow-hidden bg-[#F0F4F8] relative flex">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-[#F0F4F8] to-teal-50/50" />
      <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] bg-teal-200/30 rounded-full blur-3xl" />

      <aside className="hidden lg:flex relative z-10 lg:w-[52%] xl:w-[50%] flex-col p-7 xl:p-9 h-full overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/"
            className="text-lg font-bold text-[#0D1B2A] tracking-tight"
          >
            Jembatan <span className="text-[#1A8A7A]">Aman</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-rose-100 border border-rose-200 rounded-full px-2.5 py-1">
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
              we missed you
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-h-0 gap-4">
          <div>
            <h2 className="font-serif text-3xl xl:text-4xl font-bold text-[#0D1B2A] leading-[1.05] mb-2.5">
              udah lama gak{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#1A8A7A] to-rose-400 bg-clip-text text-transparent">
                  spill
                </span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 120 8"
                  fill="none"
                >
                  <path
                    d="M2 6C30 2 60 1 118 4"
                    stroke="#F472B6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              🌙
            </h2>
            <p className="text-sm text-[#2D3748]/70 leading-relaxed max-w-md">
              bestie, aku kangen ngobrol sama lo. cerita aja, ga ada yang
              ngehakimin di sini ✨
            </p>
          </div>

          <div className="space-y-2.5 max-w-md">
            <div className="flex justify-end">
              <div className="bg-white border border-black/5 rounded-2xl rounded-br-md px-3.5 py-2 shadow-sm max-w-[80%]">
                <p className="text-xs text-[#0D1B2A]">
                  hai LOMBUT, akhir-akhir ini agak kosong aja 😅
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-sm shrink-0 shadow-sm">
                🌙
              </div>
              <div className="bg-white border border-rose-200/60 rounded-2xl rounded-bl-md px-3.5 py-2 shadow-sm max-w-[85%]">
                <p className="text-xs text-[#0D1B2A]/80 leading-relaxed">
                  dengerin aku ya 🌱 kosong itu berat, tapi lo ga sendirian.
                  mau cerita dari mana?
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-sm shrink-0 shadow-sm">
                🌙
              </div>
              <div className="bg-white border border-rose-200/60 rounded-2xl rounded-bl-md px-3.5 py-2 shadow-sm max-w-[85%]">
                <p className="text-xs text-[#0D1B2A]/80 leading-relaxed">
                  sini spill aja bestie, aku siap dengerin sampe pagi ✨
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 max-w-md">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white/80 border border-rose-200/50 rounded-xl p-2.5 text-center"
                >
                  <div className="text-sm font-black text-[#0D1B2A] leading-none">
                    {s.value}
                  </div>
                  <div className="text-[9px] text-[#2D3748]/60 uppercase tracking-wider font-bold mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/80 border border-black/5 rounded-2xl p-3 max-w-md">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white" />
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white" />
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white" />
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700]"
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-[#0D1B2A]">4.9</span>
              </div>
              <p className="text-[10px] text-[#2D3748]/70 italic leading-snug">
                &ldquo;ngobrol sama LOMBUT berasa kayak bestie. jadi lebih ngerti
                perasaan sendiri ✨&rdquo;
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        <nav className="flex items-center justify-between px-6 py-5 shrink-0">
          <Link
            href="/"
            className="text-base font-bold text-[#0D1B2A] tracking-tight"
          >
            Jembatan <span className="text-[#1A8A7A]">Aman</span>
          </Link>
          <div className="text-xs text-[#2D3748]/70">
            belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
            >
              daftar yuk →
            </Link>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 min-h-0">
          <div className="w-full max-w-md">
            <div className="lg:hidden inline-flex items-center gap-1.5 bg-rose-100 border border-rose-200 rounded-full px-2.5 py-1 mb-3">
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                we missed you
              </span>
            </div>

            <div className="bg-white rounded-3xl p-7 md:p-8 border border-black/5 shadow-xl shadow-[#0D1B2A]/5">
              <div className="mb-5">
                <h1 className="font-serif text-3xl md:text-[2rem] font-bold text-[#0D1B2A] leading-[1.1] mb-1.5">
                  gas{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#1A8A7A] to-rose-400 bg-clip-text text-transparent">
                      lanjut
                    </span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      viewBox="0 0 120 8"
                      fill="none"
                    >
                      <path
                        d="M2 6C30 2 60 1 118 4"
                        stroke="#F472B6"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>{" "}
                  spill ✨
                </h1>
                <p className="text-xs text-[#2D3748]/60">
                  selamat datang kembali, bestie
                </p>
              </div>

              <LoginForm />
            </div>
          </div>
        </div>

        <footer className="px-6 py-4 flex flex-col items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[9px] text-[#2D3748]/50">
            <ShieldCheck className="h-2.5 w-2.5" />
            <span>
              bukan pengganti profesional. buat darurat hubungi hotline.
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}
