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

    try {
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

      router.push("/psikolog")
      router.refresh()
    } catch (err) {
      setError("Terjadi Kesalahan: " + err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert
          variant="destructive"
          className="bg-red-50 text-red-700 border-red-200 rounded-xl py-2.5 px-3.5"
        >
          <AlertDescription className="text-xs font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label
          htmlFor="email"
          className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1"
        >
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
          <Input
            id="email"
            type="email"
            placeholder="spesialis@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between ml-1">
          <Label
            htmlFor="password"
            className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase"
          >
            Password
          </Label>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10 pl-9 pr-10 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-[#2D3748]/40 hover:text-[#2D3748]/70 transition-colors rounded-md hover:bg-black/5"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-10 mt-2 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1A8A7A]/25 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 group/btn"
      >
        {loading ? (
          "Memproses..."
        ) : (
          <>
            Masuk ke Portal
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-[#2D3748]/60 mt-3">
        Belum bermitra dengan kami?{" "}
        <Link
          href="/psikolog/register"
          className="font-semibold text-[#1A8A7A] hover:text-[#0D1B2A] transition-colors underline underline-offset-4"
        >
          Daftar Sekarang
        </Link>
      </p>
    </form>
  )
}
