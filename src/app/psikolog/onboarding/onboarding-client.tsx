"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  LogOut, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useOnboardPsychologist } from "@/hooks/psychologist/useOnboardPsychologist";
import { themeStyles } from "@/lib/types/psychologist-onboarding";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Step components
import PhotoStep from "@/components/onboarding/psikolog/PhotoStep";
import FocusExpertiseStep from "@/components/onboarding/psikolog/FocusExpertiseStep";
import ExperienceScheduleStep from "@/components/onboarding/psikolog/ExperienceScheduleStep";
import PreviewConfirmStep from "@/components/onboarding/psikolog/PreviewConfirmStep";

interface OnboardingClientProps {
  userName: string;
  userEmail: string;
  roleTitle: string;
  currentImageUrl: string;
}

export default function OnboardingClient({
  userName,
  userEmail,
  roleTitle,
  currentImageUrl,
}: OnboardingClientProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = themeStyles[theme] || themeStyles.calm_blue;

  const [step, setStep] = useState(1);
  const onboardMutation = useOnboardPsychologist();
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [focusArea, setFocusArea] = useState<string>("");
  const [experienceYears, setExperienceYears] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  // Toggles & handlers
  const handlePhotoCropped = (blob: Blob, previewUrl: string) => {
    setCroppedImageBlob(blob);
    setCroppedPreviewUrl(previewUrl);
    setError(null);
  };

  const toggleTag = (tag: string) => {
    setError(null);
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleHour = (hour: string) => {
    setError(null);
    setSelectedHours((prev) => 
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const validateAndNext = () => {
    setError(null);
    if (step === 1) {
      if (!croppedPreviewUrl) {
        setError("Silakan unggah dan potong foto profil Anda terlebih dahulu.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!focusArea) {
        setError("Silakan pilih salah satu Fokus Bidang Utama.");
        return;
      }
      if (selectedTags.length === 0) {
        setError("Silakan pilih minimal 1 Tag Keahlian.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!experienceYears || isNaN(parseInt(experienceYears)) || parseInt(experienceYears) < 0) {
        setError("Silakan isi lama pengalaman kerja (tahun) dengan angka valid.");
        return;
      }
      if (selectedHours.length === 0) {
        setError("Silakan pilih minimal 1 Jam Operasional Praktek.");
        return;
      }
      setStep(4);
    }
  };

  const handleOnboardSubmit = async () => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("specialty", focusArea);
      formData.append("experienceYears", experienceYears);
      formData.append("tags", JSON.stringify(selectedTags));
      formData.append("operationalHours", JSON.stringify(selectedHours));

      if (croppedImageBlob) {
        formData.append("imageFile", croppedImageBlob, "profile.jpg");
      }

      await onboardMutation.mutateAsync(formData);
      toast.success("Profil Anda berhasil dikonfigurasi!");
      router.push("/psikolog");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data onboarding.");
      toast.error(err.message || "Gagal menyimpan data onboarding.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F0F4F8] lg:flex-row">
      
      {/* Left brand/steps panel (matches user onboarding style) */}
      <aside className="relative hidden overflow-hidden bg-[#0D1B2A] lg:flex lg:w-[44%] xl:w-[40%] shrink-0">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#1A8A7A]/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[26rem] w-[26rem] rounded-full bg-[#1A8A7A]/15 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#0D1B2A] to-[#1A8A7A]/30" />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white w-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white"
          >
            <img src="/logo-app.png" alt="Verimind Logo" className="h-8 w-auto object-contain brightness-0 invert" />
            <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
          </Link>

          {/* Stepper info */}
          <div className="space-y-8 my-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1A8A7A]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                Pendaftaran Mitra • 4 Langkah
              </span>
            </div>

            <h2 className="font-serif text-3xl font-bold leading-[1.2] xl:text-4xl">
              Lengkapi
              <br />
              <span className="text-[#1A8A7A]">Profil Praktek</span> Anda 💼
            </h2>

            <p className="max-w-sm text-xs leading-relaxed text-white/70">
              Konfigurasikan informasi ketersediaan jadwal, keahlian, dan foto profil Anda agar klien dapat menemukan Anda dengan tepat pada menu booking.
            </p>

            {/* Stepper Progress checklist */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              {[
                { number: 1, label: "Unggah Foto Profil" },
                { number: 2, label: "Fokus & Keahlian" },
                { number: 3, label: "Pengalaman & Jam Praktek" },
                { number: 4, label: "Tinjau & Konfirmasi" },
              ].map((s) => {
                const isActive = step === s.number;
                const isCompleted = step > s.number;
                return (
                  <div key={s.number} className="flex items-center gap-3.5">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isActive 
                        ? styles.stepActive + " scale-110 shadow-lg ring-4 ring-[#1A8A7A]/25" 
                        : isCompleted 
                          ? "bg-emerald-600 text-white" 
                          : "bg-white/5 border border-white/10 text-white/40"
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : s.number}
                    </div>
                    <span className={`text-xs font-bold transition-colors ${isActive ? "text-white" : isCompleted ? "text-white/80" : "text-white/40"}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom tips */}
          <div className="flex items-center gap-2.5 pt-6 border-t border-white/5">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
            <p className="text-[10px] text-white/60 leading-normal font-semibold max-w-[280px]">
              Verimind menyinkronkan jadwal operasional Anda ke sistem booking secara real-time.
            </p>
          </div>
        </div>
      </aside>

      {/* Right panel (forms/steps) */}
      <main className="relative flex flex-1 flex-col min-h-screen">
        
        {/* Top Navbar */}
        <nav className="flex items-center justify-between border-b border-black/5 bg-white/60 px-6 py-4 backdrop-blur md:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-[#0D1B2A] lg:hidden"
          >
            <img src="/logo-app.png" alt="Verimind Logo" className="h-7 w-auto object-contain" />
            <span>Veri<span className="text-[#1A8A7A]">mind</span></span>
          </Link>

          <div className="hidden text-xs text-[#2D3748]/60 lg:block">
            Mitra: <span className="font-extrabold text-[#0D1B2A]">{userName}</span> ({userEmail})
          </div>

          <button
            onClick={() => signOut({ redirectTo: "/" })}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#2D3748]/70 transition-colors hover:bg-black/5 hover:text-[#0D1B2A] cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </nav>

        {/* Wizard Panel wrapper */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-10">
          <div className="w-full max-w-2xl"> {/* Widened to max-w-2xl to give more space and look premium */}
            
            {/* Header info for mobile (hidden on desktop) */}
            <div className="mb-6 lg:hidden">
              <div className="inline-flex items-center gap-1 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1A8A7A]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2D3748]/60">
                  Langkah {step} dari 4
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0D1B2A]">
                {step === 1 && "Unggah Foto Profil"}
                {step === 2 && "Tentukan Fokus & Keahlian"}
                {step === 3 && "Pengalaman & Jam Praktek"}
                {step === 4 && "Tinjau Profil Anda"}
              </h3>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="mb-4">
                <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50 py-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-xs font-medium text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Card Container */}
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-xl shadow-[#0D1B2A]/5 md:p-9 transition-all duration-300">
              
              {/* Conditional step components mounting */}
              {step === 1 && (
                <PhotoStep
                  croppedPreviewUrl={croppedPreviewUrl}
                  onPhotoCropped={handlePhotoCropped}
                  styles={styles}
                />
              )}

              {step === 2 && (
                <FocusExpertiseStep
                  focusArea={focusArea}
                  setFocusArea={setFocusArea}
                  selectedTags={selectedTags}
                  toggleTag={toggleTag}
                  styles={styles}
                />
              )}

              {step === 3 && (
                <ExperienceScheduleStep
                  experienceYears={experienceYears}
                  setExperienceYears={setExperienceYears}
                  selectedHours={selectedHours}
                  toggleHour={toggleHour}
                  styles={styles}
                />
              )}

              {step === 4 && (
                <PreviewConfirmStep
                  userName={userName}
                  roleTitle={roleTitle}
                  croppedPreviewUrl={croppedPreviewUrl}
                  focusArea={focusArea}
                  experienceYears={experienceYears}
                  selectedTags={selectedTags}
                  selectedHours={selectedHours}
                  styles={styles}
                />
              )}

              {/* Wizard navigation actions inside card */}
              <div className="mt-8 pt-6 border-t border-[#2D3748]/5 flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Kembali
                  </Button>
                )}

                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={validateAndNext}
                    className={`flex-1 h-11 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-white bg-[#0D1B2A] hover:bg-[#1A8A7A]`}
                  >
                    Lanjutkan
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleOnboardSubmit}
                    disabled={onboardMutation.isPending}
                    className={`flex-1 h-11 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer text-white bg-[#1A8A7A] hover:bg-[#157265] shadow-lg shadow-teal-500/10`}
                  >
                    {onboardMutation.isPending ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        Simpan & Selesaikan
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-[10px] leading-relaxed text-[#2D3748]/40 font-medium">
              Dengan mengklik Simpan, Anda menyetujui ketaatan kode etik profesi dan syarat kemitraan Verimind.
              Data tersimpan terenkripsi secara aman.
            </p>

          </div>
        </div>
      </main>
    </div>
  );
}
