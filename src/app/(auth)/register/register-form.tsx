"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/lib/actions/register"

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  const passwordRules = [
    { label: "Minimal 6 karakter", met: password.length >= 6 },
    { label: "Mengandung angka", met: /\d/.test(password) },
    { label: "Mengandung huruf besar", met: /[A-Z]/.test(password) },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const result = await registerUser(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    const email = formData.get("email") as string
    const pwd = formData.get("password") as string

    await signIn("credentials", {
      email,
      password: pwd,
      redirect: false,
    })

    router.push("/onboarding")
    router.refresh()
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/onboarding" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
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

      <div className="space-y-1">
        <Label
          htmlFor="nama"
          className="text-[#0D1B2A] font-semibold text-[11px] tracking-wider uppercase ml-1"
        >
          Nama Lengkap
        </Label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D3748]/40 pointer-events-none" />
          <Input
            id="nama"
            name="nama"
            type="text"
            placeholder="Nama lengkapmu"
            required
            className="h-10 pl-10 pr-4 text-xs border-black/15 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-1">
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
            name="email"
            type="email"
            placeholder="nama@email.com"
            required
            className="h-10 pl-10 pr-4 text-xs border-black/15 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="password"
          className="text-[#0D1B2A] font-semibold text-[11px] tracking-wider uppercase ml-1"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D3748]/40 pointer-events-none" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Buat password kuat"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-10 pl-10 pr-10 text-xs border-black/15 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center text-[#2D3748]/40 hover:text-[#2D3748]/70 transition-colors rounded-md hover:bg-black/5"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {password.length > 0 && (
          <div className="mt-1.5 space-y-1 ml-1">
            {passwordRules.map((rule) => (
              <div
                key={rule.label}
                className={`flex items-center gap-1.5 text-[10px] transition-colors ${
                  rule.met ? "text-[#1A8A7A]" : "text-[#2D3748]/40"
                }`}
              >
                <Check
                  className={`h-2.5 w-2.5 transition-opacity ${
                    rule.met ? "opacity-100" : "opacity-30"
                  }`}
                />
                <span>{rule.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-10 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1A8A7A]/25 font-semibold text-xs cursor-pointer flex items-center justify-center gap-2 group/btn"
      >
        {loading ? (
          "Membuat akun..."
        ) : (
          <>
            Daftar
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-black/10" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-semibold">
          <span className="bg-white px-3 text-[#2D3748]/40">atau</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full h-10 border border-black/10 bg-white hover:bg-[#F0F4F8] hover:border-[#1A8A7A]/30 text-[#0D1B2A] hover:text-[#1A8A7A] rounded-full transition-all duration-300 hover:shadow-sm flex items-center justify-center gap-2 font-semibold text-xs cursor-pointer active:scale-[0.99]"
        onClick={handleGoogle}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
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
        <span>Daftar dengan Google</span>
      </button>

      <p className="text-center text-xs text-[#2D3748]/60 mt-3">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors underline underline-offset-4"
        >
          Masuk
        </Link>
      </p>

      <p className="text-center text-[9px] text-[#2D3748]/40 mt-2.5 leading-relaxed">
        Dengan mendaftar, kamu menyetujui{" "}
        <a href="#" className="underline hover:text-[#1A8A7A]">
          Syarat & Ketentuan
        </a>{" "}
        serta{" "}
        <a href="#" className="underline hover:text-[#1A8A7A]">
          Kebijakan Privasi
        </a>{" "}
        kami.
      </p>
    </form>
  )
}
