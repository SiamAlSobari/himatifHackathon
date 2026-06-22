"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

import {
  ONBOARDING_STEPS,
  type OnboardingStep,
  type AgeRangeId,
  type GenderId,
  type GoalId,
  type OnboardingFormData,
} from "@/lib/types/onboarding"
import { AGE_RANGES } from "@/lib/types/onboarding"
import { saveOnboardingProfile } from "@/lib/actions/onboarding"

import OnboardingProgress from "./OnboardingProgress"
import WelcomeStep from "./WelcomeStep"
import AgeStep from "./AgeStep"
import GenderStep from "./GenderStep"
import EmergencyContactStep from "./EmergencyContactStep"
import GoalsStep from "./GoalsStep"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OnboardingFormProps {
  userName?: string | null
  userEmail?: string | null
  initialData?: Partial<OnboardingFormData>
}

export default function OnboardingForm({
  userName,
  userEmail,
  initialData,
}: OnboardingFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [step, setStep] = useState<OnboardingStep>("welcome")
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<OnboardingFormData>({
    usia: initialData?.usia ?? null,
    jenisKelamin: initialData?.jenisKelamin ?? null,
    kontakDarurat: initialData?.kontakDarurat ?? "",
    tujuan: initialData?.tujuan ?? null,
  })

  const currentStepIndex = ONBOARDING_STEPS.indexOf(step)
  const isFirstStep = step === "welcome"

  const goToStep = (next: OnboardingStep) => {
    setError(null)
    setStep(next)
  }

  const goNext = () => {
    const nextIdx = currentStepIndex + 1
    if (nextIdx < ONBOARDING_STEPS.length) {
      goToStep(ONBOARDING_STEPS[nextIdx])
    }
  }

  const goBack = () => {
    const prevIdx = currentStepIndex - 1
    if (prevIdx >= 0) {
      goToStep(ONBOARDING_STEPS[prevIdx])
    }
  }

  const handleAgeSelect = (id: AgeRangeId) => {
    setError(null)
    const range = AGE_RANGES.find((r) => r.id === id)
    const mid = range
      ? Math.round((range.range[0] + range.range[1]) / 2)
      : null
    setFormData((prev) => ({ ...prev, usia: mid }))
    setTimeout(goNext, 220)
  }

  const handleGenderSelect = (id: GenderId) => {
    setError(null)
    setFormData((prev) => ({ ...prev, jenisKelamin: id }))
    setTimeout(goNext, 220)
  }

  const handleGoalSelect = (id: GoalId) => {
    setError(null)
    setFormData((prev) => ({ ...prev, tujuan: id }))
  }

  const handleEmergencyChange = (value: string) => {
    setError(null)
    setFormData((prev) => ({ ...prev, kontakDarurat: value }))
  }

  const handleFinalSubmit = () => {
    if (!formData.usia || !formData.jenisKelamin) {
      setError("Data wajib belum lengkap. Cek lagi ya.")
      return
    }

    startTransition(async () => {
      const result = await saveOnboardingProfile({
        usia: formData.usia!,
        jenisKelamin: formData.jenisKelamin!,
        kontakDarurat: formData.kontakDarurat?.trim() || null,
      })

      if (!result.success) {
        setError(result.error ?? "Gagal menyimpan profil")
        return
      }

      router.push("/screening")
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F4F8] lg:flex-row">
      {/* Left brand panel (matches landing page aesthetic) */}
      <aside className="relative hidden overflow-hidden bg-[#0D1B2A] lg:flex lg:w-[44%] xl:w-[40%] animate-slide-left duration-700">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#1A8A7A]/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-[#1A8A7A]/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#0D1B2A] to-[#1A8A7A]/30" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
          >
            <img src="/logo-app.png" alt="Verimind Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
          </Link>

          {/* Center content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A8A7A]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                Onboarding • 5 Pertanyaan
              </span>
            </div>

            <h2 className="font-serif text-4xl font-bold leading-[1.1] xl:text-5xl">
              Yuk, kita
              <br />
              <span className="text-[#1A8A7A]">kenalan</span> dulu 🌱
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Bikin <strong className="font-bold text-white">Verimind</strong>{" "}
              ngerti kamu lebih baik, biar tiap percakapan terasa lebih personal
              &amp; bermakna. Semua data dienkripsi &amp; 100% privat.
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <p className="text-2xl font-black text-white">5</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Pertanyaan
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <p className="text-2xl font-black text-white">60s</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Estimasi
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                <p className="text-2xl font-black text-white">100%</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Privat
                </p>
              </div>
            </div>
          </div>

          {/* Bottom: mini chat preview + AI character */}
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-xs">
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20">
                  <Image
                    src="/mommy.jpg"
                    alt="Very AI"
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
                  <p className="text-[11px] leading-relaxed text-white/80">
                    siap-siap ya, aku bakal nyapa kamu dengan cara yang cocok ✨
                  </p>
                </div>
              </div>
            </div>

            <div className="relative hidden h-32 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl xl:block">
              <Image
                src="/mommy.jpg"
                alt="Very AI"
                fill
                className="object-cover object-top"
                sizes="120px"
              />
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-[#1A8A7A] rounded-tl-xl" />
            </div>
          </div>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="relative flex flex-1 flex-col animate-fade-in duration-500">
        {/* Top bar */}
        <nav className="flex items-center justify-between border-b border-black/5 bg-white/60 px-6 py-4 backdrop-blur md:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-[#0D1B2A] lg:hidden"
          >
            <img src="/logo-app.png" alt="Verimind Logo" className="h-7 w-auto object-contain" />
            <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
          </Link>

          <div className="hidden text-xs text-[#2D3748]/60 lg:block">
            Masuk sebagai{" "}
            <span className="font-bold text-[#0D1B2A]">
              {userName || userEmail || "teman"}
            </span>
          </div>

          <button
            onClick={() => signOut({ redirectTo: "/" })}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#2D3748]/70 transition-colors hover:bg-black/5 hover:text-[#0D1B2A] cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </nav>

        <div className="flex flex-1 items-center justify-center px-5 py-8 md:px-10">
          <div className="w-full max-w-xl">
            {/* Progress (hidden on welcome) */}
            {!isFirstStep && (
              <div className="mb-8">
                <OnboardingProgress currentStep={step} />
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-4">
                <Alert
                  variant="destructive"
                  className="rounded-2xl border-red-200 bg-red-50"
                >
                  <AlertDescription className="text-xs font-medium text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Card container */}
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-[#0D1B2A]/5 md:p-9 animate-fade-up duration-700 hover-lift shadow-premium">
              {step === "welcome" && (
                <WelcomeStep
                  userName={userName}
                  onNext={goNext}
                />
              )}

              {step === "usia" && (
                <AgeStep
                  selected={
                    formData.usia
                      ? AGE_RANGES.find((r) =>
                          formData.usia! >= r.range[0] &&
                          formData.usia! <= r.range[1]
                        )?.id ?? null
                      : null
                  }
                  onSelect={handleAgeSelect}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}

              {step === "gender" && (
                <GenderStep
                  selected={formData.jenisKelamin}
                  onSelect={handleGenderSelect}
                  onNext={goNext}
                  onBack={goBack}
                />
              )}

              {step === "emergency" && (
                <EmergencyContactStep
                  value={formData.kontakDarurat}
                  onChange={handleEmergencyChange}
                  onNext={goNext}
                  onBack={goBack}
                  onSkip={goNext}
                />
              )}

              {step === "goals" && (
                <GoalsStep
                  selected={formData.tujuan}
                  onSelect={handleGoalSelect}
                  onNext={handleFinalSubmit}
                  onBack={goBack}
                  loading={isPending}
                />
              )}
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-[10px] leading-relaxed text-[#2D3748]/40">
              dengan melanjutkan, kamu menyetujui{" "}
              <a
                href="#"
                className="underline underline-offset-2 transition-colors hover:text-[#1A8A7A]"
              >
                Kebijakan Privasi
              </a>{" "}
              Verimind. data kamu dienkripsi end-to-end.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
