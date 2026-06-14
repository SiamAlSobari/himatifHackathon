import Image from "next/image"
import Link from "next/link"
import {
  ShieldCheck,
  Sparkles,
  Lock,
  MessageCircle,
  Heart,
  Zap,
  Star,
  Quote,
} from "lucide-react"

const features = [
  { icon: MessageCircle, label: "AI 24/7" },
  { icon: Lock, label: "Privat" },
  { icon: Zap, label: "Personal" },
]

const stats = [
  { value: "4.9", suffix: "★", label: "rating" },
  { value: "1.2k+", suffix: "", label: "cerita" },
  { value: "100%", suffix: "", label: "aman" },
]

const moods = ["#selflove", "#healing", "#growth", "#nofear", "#youmatter"]

export default function BrandingPanel() {
  return (
    <div className="flex h-full flex-col justify-between text-[#0D1B2A] relative">
      <div className="absolute -top-3 right-2 z-20 rotate-12 hidden xl:block">
        <div className="bg-[#FFD700] text-[#0D1B2A] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
          no cap 💯
        </div>
      </div>

      <div className="absolute top-[55%] -right-3 z-20 -rotate-6 hidden xl:block">
        <div className="bg-[#C4B5FD] text-[#0D1B2A] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
          vibe check ✓
        </div>
      </div>

      <div className="absolute bottom-20 left-2 z-20 rotate-6 hidden xl:block">
        <div className="bg-[#FBCFE8] text-[#0D1B2A] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
          real talk 💚
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-lg font-bold tracking-tight hover:opacity-80 transition-opacity w-fit"
        >
          Jembatan <span className="text-[#1A8A7A]">Aman</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 bg-[#1A8A7A]/10 border border-[#1A8A7A]/20 rounded-full px-3 py-1.5">
          <Sparkles className="h-3 w-3 text-[#1A8A7A]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A8A7A]">
            Real Talk Only
          </span>
        </div>
      </div>

      <div className="space-y-4 my-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A8A7A] mb-2">
            ✨ tempat aman buat lo
          </p>
          <h2 className="font-serif text-3xl xl:text-4xl font-bold leading-[1.05] mb-2.5">
            mulai spill
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#1A8A7A] via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                ceritamu
              </span>
              <svg
                className="absolute -bottom-1.5 left-0 w-full"
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
            </span>
            <span className="inline-block ml-1 animate-pulse">🌱</span>
          </h2>
          <p className="text-sm text-[#2D3748]/70 leading-relaxed max-w-sm">
            gak ada judgment, gak ada cap. cuma lo & AI yang siap dengerin 24/7.
            real talk, real help.
          </p>
        </div>

        <div className="relative max-w-[260px]">
          <div
            className="relative bg-gradient-to-br from-[#F0F4F8] to-[#E2E8F0] rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-[#0D1B2A]/10"
            style={{ height: "160px" }}
          >
            <Image
              src="/mommy.jpg"
              alt="LOMBUT AI"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#1A8A7A] rounded-tl-2xl" />

            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm border border-white/40 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-sm">
              <Heart className="h-2.5 w-2.5 text-rose-500 fill-rose-500" />
              <span className="text-[9px] font-bold text-[#0D1B2A]">
                bestie mode
              </span>
            </div>
          </div>

          <div className="absolute -bottom-2 -left-2 bg-white border border-[#E2E8F0] rounded-full pl-1 pr-3 py-1 shadow-lg z-20 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-[10px] font-bold text-[#0D1B2A]">
              online skrg
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 max-w-md">
          {features.map((f) => (
            <div
              key={f.label}
              className="inline-flex items-center gap-1.5 bg-white border border-[#1A8A7A]/15 rounded-full pl-2 pr-3 py-1.5 hover:border-[#1A8A7A]/40 hover:bg-[#1A8A7A]/5 transition-all cursor-default"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A8A7A]/10">
                <f.icon className="h-2.5 w-2.5 text-[#1A8A7A]" />
              </div>
              <span className="text-[11px] font-bold text-[#0D1B2A]">
                {f.label}
              </span>
            </div>
          ))}
          <div className="inline-flex items-center gap-1.5 bg-[#0D1B2A] text-white rounded-full pl-2 pr-3 py-1.5">
            <Sparkles className="h-2.5 w-2.5 text-[#FFD700]" />
            <span className="text-[11px] font-bold">free trial</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-md pt-3 border-t border-dashed border-[#0D1B2A]/15">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg xl:text-xl font-black text-[#1A8A7A] leading-none">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm text-[#FFD700] ml-0.5">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div className="text-[9px] text-[#2D3748]/60 uppercase tracking-wider font-bold mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="relative bg-white/80 backdrop-blur-sm border border-[#1A8A7A]/15 rounded-2xl p-3.5 max-w-md shadow-sm">
          <Quote className="absolute -top-2.5 -left-2.5 h-6 w-6 p-1 text-[#1A8A7A] fill-white bg-white rounded-full shadow-sm border border-[#1A8A7A]/15" />
          <p className="text-[11px] text-[#2D3748]/80 italic leading-relaxed mb-2.5">
            &ldquo;akhirnya ada tempat spill tanpa dihakimi. bestie mode-nya ngena
            bgt 💚&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
              R
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#0D1B2A] leading-tight">
                R, 21
              </p>
              <p className="text-[9px] text-[#2D3748]/50 leading-tight">
                mahasiswa • verified
              </p>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="h-2.5 w-2.5 fill-[#FFD700] text-[#FFD700]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 max-w-md">
          {moods.map((mood) => (
            <span
              key={mood}
              className="text-[10px] font-bold text-[#1A8A7A] bg-[#1A8A7A]/8 border border-[#1A8A7A]/15 rounded-full px-2.5 py-1 hover:bg-[#1A8A7A]/15 transition-colors cursor-default"
            >
              {mood}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#2D3748]/50 pt-2 border-t border-dashed border-[#0D1B2A]/10">
          <ShieldCheck className="h-3 w-3" />
          <span>
            bukan pengganti profesional. buat darurat hubungi hotline.
          </span>
        </div>
      </div>
    </div>
  )
}
