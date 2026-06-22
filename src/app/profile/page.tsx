"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, User, Calendar, Smile, Send, CheckCircle2, ShieldAlert, Lock } from "lucide-react";
import ProfileCard from "@/components/profile/Profilecard";
import QuickHelpCard from "@/components/profile/Quickhelpcard";
import PersonalInfoCard from "@/components/profile/Personainfocard";
import AccountSettingsCard from "@/components/profile/Accountsettingcard";
import ConsultationHistoryCard from "@/components/profile/Consultationhistorycard";
import ScreeningTrendsCard from "@/components/profile/ScreeningTrendsCard";
import { useProfile, useUpdateProfile, useSendOtp, useVerifyOtp, useUpdatePassword } from "@/hooks/profile/useProfile";
import { quickHelpLinks } from "./data";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isLoading } = useProfile();
  
  const updateProfileMutation = useUpdateProfile();
  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const updatePasswordMutation = useUpdatePassword();

  // Modal Visibility States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Phone verification state
  const [otpStep, setOtpStep] = useState<"input" | "verify">("input");
  const [otpCode, setOtpCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [phoneModalError, setPhoneModalError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  // Form Input States (Profile)
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<number | "">("");
  const [editGender, setEditGender] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Password Input States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordModalError, setPasswordModalError] = useState<string | null>(null);

  // Sync state when data is loaded
  useEffect(() => {
    if (data?.dbUser) {
      setEditName(data.dbUser.name || "");
      setEditAge(data.dbUser.usia || "");
      setEditGender(data.dbUser.jenisKelamin || "");
      setEditPhone(data.dbUser.kontakDarurat || "");
    }
  }, [data]);

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Keep routing redirects from MVP
  useEffect(() => {
    if (!isLoading && data) {
      if (!data.dbUser.usia || !data.dbUser.jenisKelamin) {
        router.push("/onboarding");
      } else if (!data.hasScreenedToday) {
        router.push("/screening");
      }
    }
  }, [data, isLoading, router]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayName = data.dbUser.name || "Pengguna";
  const email = data.dbUser.email || "-";
  const age = data.dbUser.usia || null;
  const phoneNumber = data.dbUser.kontakDarurat || null;

  // Format gender label
  const getGenderLabel = (g: string) => {
    if (g === "LAKI_LAKI" || g === "male") return "Laki-laki";
    if (g === "PEREMPUAN" || g === "female") return "Perempuan";
    if (g === "nonbinary") return "Non-biner";
    if (g === "prefer_not_say") return "Lebih baik tidak menyebutkan";
    return g || "-";
  };

  const handleOpenProfileModal = () => {
    setEditName(data.dbUser.name || "");
    setEditAge(data.dbUser.usia || "");
    setEditGender(data.dbUser.jenisKelamin || "");
    setIsProfileModalOpen(true);
  };

  const handleOpenPhoneModal = () => {
    setEditPhone(data.dbUser.kontakDarurat || "");
    setOtpStep("input");
    setOtpCode("");
    setPhoneModalError(null);
    setDemoCode(null);
    setIsPhoneModalOpen(true);
  };

  const handleOpenPasswordModal = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordModalError(null);
    setIsPasswordModalOpen(true);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!editAge || Number(editAge) < 10 || Number(editAge) > 100) {
      toast.error("Usia harus antara 10 - 100 tahun.");
      return;
    }
    if (!editGender) {
      toast.error("Pilih identitas diri terlebih dahulu.");
      return;
    }

    const toastId = toast.loading("Memperbarui profil...");

    updateProfileMutation.mutate(
      {
        name: editName,
        usia: Number(editAge),
        jenisKelamin: editGender,
      },
      {
        onSuccess: () => {
          toast.success("Profil berhasil diperbarui!", { id: toastId });
          setIsProfileModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Gagal memperbarui profil.", { id: toastId });
        },
      }
    );
  };

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneModalError(null);
    setDemoCode(null);
    
    const rawInput = editPhone.trim();
    if (!rawInput) {
      setPhoneModalError("Nomor telepon tidak boleh kosong.");
      return;
    }

    const toastId = toast.loading("Mengirim kode verifikasi OTP...");

    sendOtpMutation.mutate(rawInput, {
      onSuccess: (res) => {
        setOtpStep("verify");
        setResendCooldown(60);
        setEditPhone(res.formattedPhone); // Use formatted phone returned from API
        
        if (res.mocked && res.code) {
          setDemoCode(res.code);
          toast.info(`[Demo Mode] OTP: ${res.code}`, { id: toastId, duration: 8000 });
        } else {
          toast.success("Kode verifikasi telah dikirim!", { id: toastId });
        }
      },
      onError: (err: any) => {
        const errMsg = err.message || "Gagal mengirim kode verifikasi.";
        setPhoneModalError(errMsg);
        toast.error(errMsg, { id: toastId });
      },
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneModalError(null);
    const cleanCode = otpCode.trim();
    if (!cleanCode) {
      setPhoneModalError("Kode verifikasi OTP tidak boleh kosong.");
      return;
    }

    const toastId = toast.loading("Memverifikasi nomor telepon...");

    verifyOtpMutation.mutate(
      {
        phoneNumber: editPhone,
        otpCode: cleanCode,
      },
      {
        onSuccess: () => {
          toast.success("Nomor telepon berhasil diverifikasi & diperbarui!", { id: toastId });
          setIsPhoneModalOpen(false);
          setOtpStep("input");
          setOtpCode("");
          setDemoCode(null);
        },
        onError: (err: any) => {
          const errMsg = err.message || "Gagal memverifikasi kode OTP.";
          setPhoneModalError(errMsg);
          toast.error(errMsg, { id: toastId });
        },
      }
    );
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordModalError(null);

    if (!currentPassword) {
      setPasswordModalError("Password saat ini wajib diisi.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordModalError("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordModalError("Konfirmasi password baru tidak cocok.");
      return;
    }

    const toastId = toast.loading("Memperbarui kata sandi...");

    updatePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Kata sandi berhasil diperbarui!", { id: toastId });
          setIsPasswordModalOpen(false);
        },
        onError: (err: any) => {
          const errMsg = err.message || "Gagal memperbarui kata sandi.";
          setPasswordModalError(errMsg);
          toast.error(errMsg, { id: toastId });
        },
      }
    );
  };

  const handleForgotPasswordRedirect = () => {
    setIsPasswordModalOpen(false);
    router.push(`/forgot-password?email=${encodeURIComponent(data.dbUser.email)}`);
  };
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 overflow-hidden">
      {/* Upper Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1 animate-slide-left duration-700">
          <div className="hover-lift shadow-premium rounded-2xl">
            <ProfileCard
              name={displayName}
              age={age}
              location={getGenderLabel(data.dbUser.jenisKelamin)}
              avatarUrl={data.dbUser.image}
              onEdit={handleOpenProfileModal}
            />
          </div>
          <div className="hover-lift shadow-premium rounded-2xl">
            <QuickHelpCard title="Butuh Bantuan?" links={quickHelpLinks} />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2 animate-slide-right delay-100 duration-700">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 h-full">
            <div className="hover-lift shadow-premium rounded-2xl">
              <PersonalInfoCard
                fullName={displayName}
                email={email}
                phoneNumber={phoneNumber}
                onEditPhone={handleOpenPhoneModal}
              />
            </div>
            <div className="hover-lift shadow-premium rounded-2xl">
              <AccountSettingsCard 
                initialNotificationsEnabled={false} 
                onUpdatePassword={handleOpenPasswordModal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Screening Trends Graph */}
      <div className="animate-fade-up delay-200 duration-700 hover-lift shadow-premium rounded-2xl">
        <ScreeningTrendsCard
          trends={data.wellnessTrends}
          metrics={data.metrics}
        />
      </div>

      {/* Real-time Consultation History Table */}
      <div className="animate-fade-up delay-300 duration-700 hover-lift shadow-premium rounded-2xl">
        <ConsultationHistoryCard
          title="Riwayat Konsultasi"
          viewAllLabel="Lihat Semua"
          items={data.consultationHistory}
          onViewAll={() => router.push("/riwayatkonsultasi")}
        />
      </div>      {/* ============================================================ */}
      {/* MODAL 1: UPDATE PROFILE (Name, Age, Gender) */}
      {/* ============================================================ */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[440px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">manage_accounts</span>
                Ubah Profil Anda
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              {/* Usia */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Usia (Tahun)
                </label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Contoh: 21"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Smile className="h-3.5 w-3.5 text-slate-400" />
                  Identitas / Jenis Kelamin
                </label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25 cursor-pointer"
                  disabled={updateProfileMutation.isPending}
                >
                  <option value="" disabled>Pilih salah satu</option>
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                  <option value="nonbinary">Non-biner</option>
                  <option value="prefer_not_say">Lebih baik tidak menyebutkan</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={updateProfileMutation.isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: UPDATE PHONE NUMBER WITH VERIFICATION (OTP) */}
      {/* ============================================================ */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[400px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">contact_phone</span>
                {otpStep === "input" ? "Verifikasi Nomor Telepon" : "Masukkan Kode OTP"}
              </h3>
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors"
                disabled={sendOtpMutation.isPending || verifyOtpMutation.isPending}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Display inside Modal */}
            {phoneModalError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 border border-rose-100/50 text-rose-600">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">{phoneModalError}</p>
              </div>
            )}

            {/* Form Step 1: Input Phone Number */}
            {otpStep === "input" ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Masukkan Nomor Telepon Baru
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Contoh: 08123456789 atau +62..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                    disabled={sendOtpMutation.isPending}
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format bebas (backend akan memformat otomatis ke format negara, contoh: 62812xxx). Kode OTP akan dikirim via WhatsApp/SMS Fonte.
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsPhoneModalOpen(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                    disabled={sendOtpMutation.isPending}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    disabled={sendOtpMutation.isPending}
                  >
                    {sendOtpMutation.isPending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Kirim OTP
                        <Send className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Form Step 2: Input OTP Verification Code */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-slate-500 space-y-1">
                  <p className="text-xs font-medium">
                    Kode verifikasi telah dikirim ke nomor:
                  </p>
                  <p className="text-sm font-bold text-slate-700">{editPhone}</p>
                </div>

                {/* Demo Helper Box */}
                {demoCode && (
                  <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3 flex items-center gap-2 text-teal-700">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <p className="text-[11px] font-semibold">
                      [Demo Mode] OTP dari server: <span className="font-mono text-xs font-black tracking-widest text-teal-900">{demoCode}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                    Kode Verifikasi (6 Digit)
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    placeholder="......"
                    className="w-full text-center tracking-widest font-mono text-lg font-black rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25 placeholder:tracking-normal"
                    disabled={verifyOtpMutation.isPending}
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {/* Resend Cooldown Button */}
                <div className="text-center">
                  {resendCooldown > 0 ? (
                    <span className="text-[11px] font-semibold text-slate-400">
                      Kirim ulang kode dalam <strong className="text-slate-500 font-bold">{resendCooldown} detik</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="text-[11px] font-extrabold text-primary hover:underline hover:opacity-85 cursor-pointer"
                      disabled={sendOtpMutation.isPending}
                    >
                      Kirim ulang kode verifikasi
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                  <button
                    type="button"
                    onClick={() => setOtpStep("input")}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                    disabled={verifyOtpMutation.isPending}
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    disabled={verifyOtpMutation.isPending}
                  >
                    {verifyOtpMutation.isPending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Verifikasi & Simpan"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: UPDATE PASSWORD */}
      {/* ============================================================ */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[420px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">shield_lock</span>
                Ubah Kata Sandi
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors"
                disabled={updatePasswordMutation.isPending}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Message */}
            {passwordModalError && (
              <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 border border-rose-100/50 text-rose-600">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">{passwordModalError}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    Kata Sandi Saat Ini
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPasswordRedirect}
                    className="text-[10px] font-bold text-primary hover:underline hover:opacity-85 cursor-pointer"
                  >
                    Lupa password?
                  </button>
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi saat ini"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updatePasswordMutation.isPending}
                />
              </div>

              {/* New Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updatePasswordMutation.isPending}
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  Konfirmasi Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updatePasswordMutation.isPending}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={updatePasswordMutation.isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  disabled={updatePasswordMutation.isPending}
                >
                  {updatePasswordMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Ubah Sandi"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}