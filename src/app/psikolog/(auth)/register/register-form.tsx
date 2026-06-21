"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Briefcase, FileText, Image as ImageIcon, Tag, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRegisterPsychologist } from "@/hooks/psychologist/useRegisterPsychologist"
import { PasswordRule } from "../types"

export function RegisterForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")

    const passwordRules: PasswordRule[] = [
        { label: "Minimal 6 karakter", met: password.length >= 6 },
        { label: "Mengandung angka", met: /\d/.test(password) },
        { label: "Mengandung huruf besar", met: /[A-Z]/.test(password) },
    ]

    const { mutateAsync } = useRegisterPsychologist()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        try {
            await mutateAsync(formData)

            const email = formData.get("email") as string
            const pwd = formData.get("password") as string

            // Log in automatically after registration
            const signInResult = await signIn("credentials", {
                email,
                password: pwd,
                redirect: false,
            })

            if (signInResult?.error) {
                setError("Akun berhasil dibuat, silakan masuk secara manual.")
                setLoading(false)
                router.push("/login")
                return
            }

            router.push("/psikolog")
            router.refresh()
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat mendaftar.")
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
                <Alert
                    variant="destructive"
                    className="bg-red-50 text-red-700 border-red-200 rounded-xl py-2 px-3"
                >
                    <AlertDescription className="text-[11px] font-medium leading-normal">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Account Info Section */}
            <div className="space-y-2.5">
                <h3 className="text-[10px] font-black text-[#0D1B2A]/40 uppercase tracking-widest">
                    Informasi Akun
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                            Nama Lengkap & Gelar
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Rian Adi, M.Psi., Psikolog"
                                required
                                className="h-9 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="rian@verimind.com"
                                required
                                className="h-9 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Buat password kuat"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="h-9 pl-9 pr-10 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-[#2D3748]/40 hover:text-[#2D3748]/70 transition-colors rounded-md hover:bg-black/5"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                    </div>

                    {password.length > 0 && (
                        <div className="mt-1 space-y-1 ml-1 flex flex-wrap gap-x-3 gap-y-0.5">
                            {passwordRules.map((rule) => (
                                <div
                                    key={rule.label}
                                    className={`flex items-center gap-1 text-[9px] transition-colors ${rule.met ? "text-[#1A8A7A]" : "text-[#2D3748]/40"
                                        }`}
                                >
                                    <Check className={`h-2.5 w-2.5 transition-opacity ${rule.met ? "opacity-100" : "opacity-30"}`} />
                                    <span>{rule.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Profile Section */}
            <div className="space-y-2.5 pt-1 border-t border-black/5">
                <h3 className="text-[10px] font-black text-[#0D1B2A]/40 uppercase tracking-widest">
                    Informasi Profesional
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                        <Label htmlFor="roleTitle" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                            Spesialisasi Role
                        </Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                            <Input
                                id="roleTitle"
                                name="roleTitle"
                                type="text"
                                placeholder="Psikolog Klinis"
                                required
                                className="h-9 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="specialty" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                            Fokus Bidang
                        </Label>
                        <div className="relative">
                            <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                            <Input
                                id="specialty"
                                name="specialty"
                                type="text"
                                placeholder="Kecemasan, Trauma, Karir"
                                required
                                className="h-9 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                        <Label htmlFor="experienceYears" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                            Pengalaman (Tahun)
                        </Label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                            <Input
                                id="experienceYears"
                                name="experienceYears"
                                type="number"
                                placeholder="5"
                                min="0"
                                required
                                className="h-9 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="imageFile" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                            Foto Profil
                        </Label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                            <Input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                required
                                className="h-9 pl-9 pr-3 py-1.5 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <Label htmlFor="tags" className="text-[#0D1B2A] font-bold text-[10px] tracking-wider uppercase ml-1">
                        Tag Keahlian (Pisahkan dengan koma)
                    </Label>
                    <div className="relative">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D3748]/40 pointer-events-none" />
                        <Input
                            id="tags"
                            name="tags"
                            type="text"
                            placeholder="Trauma, Cemas, Depresi, Remaja"
                            className="h-9 pl-9 pr-3 text-xs border-black/10 focus-visible:border-[#1A8A7A] focus-visible:ring-[#1A8A7A]/15 rounded-xl transition-all"
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 mt-3 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#1A8A7A]/25 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 group/btn"
            >
                {loading ? (
                    "Mendaftarkan..."
                ) : (
                    <>
                        Daftar Sebagai Mitra
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                )}
            </Button>
        </form>
    )
}
