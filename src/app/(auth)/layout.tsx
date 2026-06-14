import Link from "next/link"
import { Users, Sparkles } from "lucide-react"
import BrandingPanel from "@/components/auth/BrandingPanel"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden bg-[#F0F4F8] relative">
      <div className="absolute top-0 right-0 w-[35rem] h-[35rem] bg-[#1A8A7A]/12 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-[#C4B5FD]/25 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 h-full grid lg:grid-cols-[1fr_1fr]">
        <aside className="hidden lg:flex p-8 xl:p-12 h-full overflow-hidden">
          <BrandingPanel />
        </aside>

        <main className="flex flex-col items-center justify-center p-4 sm:p-6 h-full overflow-hidden">
          <div className="lg:hidden w-full max-w-md mb-4 flex items-center justify-between shrink-0">
            <Link
              href="/"
              className="inline-flex items-center text-base font-bold tracking-tight text-[#0D1B2A] hover:text-[#1A8A7A] transition-colors"
            >
              Jembatan <span className="text-[#1A8A7A]">Aman</span>
            </Link>
            <Link
              href="/"
              className="text-[11px] font-medium text-[#2D3748]/60 hover:text-[#1A8A7A] transition-colors"
            >
              ← beranda
            </Link>
          </div>

          <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center lg:flex-none lg:justify-center">
            {children}

            <div className="hidden lg:flex items-center gap-2 mt-5 text-[11px] text-[#2D3748]/60">
              <div className="flex -space-x-1.5">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-2 border-white" />
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white" />
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white" />
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white" />
              </div>
              <Users className="h-3 w-3 text-[#1A8A7A]" />
              <span>
                <span className="font-bold text-[#0D1B2A]">1,200+</span> yang
                udah mulai spill hari ini
              </span>
              <Sparkles className="h-3 w-3 text-[#FFD700]" />
            </div>
          </div>

          <div className="lg:hidden mt-3 text-center text-[10px] text-[#2D3748]/50 max-w-xs leading-relaxed shrink-0">
            © 2024 jembatan aman. bukan pengganti profesional.
          </div>
        </main>
      </div>
    </div>
  )
}
