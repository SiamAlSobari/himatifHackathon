"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Email atau password salah")
      setLoading(false)
      return
    }
    // Tentukan tujuan setelah login (onboarding / screening / dashboard)
    try {
      const destRes = await fetch("/api/auth/destination", { method: "POST", credentials: "include" })
      const destJson = await destRes.json()
      const dest = destJson?.data?.destination || "/dashboard"
      router.push(dest)
    } catch (err) {
      console.log("Error login redirect:" + err)
      router.push("/dashboard")
    }
    router.refresh()
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <Alert
          variant="destructive"
          className="bg-red-50 text-red-700 border-red-200 rounded-xl"
        >
          <AlertDescription className="text-xs font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-[#0D1B2A] font-semibold text-[11px] tracking-wider uppercase ml-1"
        >
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D3748]/40 pointer-events-none" />
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 pl-11 pr-4 text-sm border-black/15 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between ml-1">
          <Label
            htmlFor="password"
            className="text-[#0D1B2A] font-semibold text-[11px] tracking-wider uppercase"
          >
            Password
          </Label>
          <Link
            href="#"
            className="text-[11px] font-medium text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors"
          >
            Lupa password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D3748]/40 pointer-events-none" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 pl-11 pr-11 text-sm border-black/15 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-[#2D3748]/40 hover:text-[#2D3748]/70 transition-colors rounded-md hover:bg-black/5"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1A8A7A]/25 font-semibold cursor-pointer flex items-center justify-center gap-2 group/btn"
      >
        {loading ? (
          "Memproses..."
        ) : (
          <>
            Masuk
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-black/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase font-medium">
          <span className="bg-white px-3 text-[#2D3748]/50">atau</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full h-11 border border-black/10 bg-white hover:bg-[#F0F4F8] hover:border-[#1A8A7A]/30 text-[#0D1B2A] hover:text-[#1A8A7A] rounded-full transition-all duration-300 hover:shadow-sm flex items-center justify-center gap-2 font-semibold cursor-pointer active:scale-[0.99]"
        onClick={handleGoogle}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Masuk dengan Google</span>
      </button>

      <p className="text-center text-sm text-[#2D3748]/60 mt-4">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors underline underline-offset-4"
        >
          Daftar
        </Link>
      </p>
    </form>
  )
}
