"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, User, Briefcase, Award, Send, CheckCircle2, ShieldAlert, Lock, Settings, ChevronRight, ShieldCheck } from "lucide-react";

import {
  usePsychologistProfile,
  useUpdatePsychologistProfile,
  useSendPsychologistOtp,
  useVerifyPsychologistOtp,
  useUpdatePsychologistPassword,
} from "@/hooks/psychologist/usePsychologistProfile";

import PsychologistProfileCard from "@/components/psikolog/profile/PsychologistProfileCard";
import PsychologistPersonalInfoCard from "@/components/psikolog/profile/PsychologistPersonalInfoCard";
import ConsultationTrendsCard from "@/components/psikolog/profile/ConsultationTrendsCard";
import PsychologistConsultationHistoryCard from "@/components/psikolog/profile/PsychologistConsultationHistoryCard";
import type { UpdatePsychologistProfilePayload } from "@/lib/types/psychologist-profile";

// ─── Modal: Edit Profile ──────────────────────────────────────────────────────
function EditProfileModal({
  initialName,
  initialRole,
  initialSpecialty,
  initialExp,
  onClose,
  onSave,
  isPending,
}: {
  initialName: string;
  initialRole: string;
  initialSpecialty: string;
  initialExp: number;
  onClose: () => void;
  onSave: (payload: UpdatePsychologistProfilePayload) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(initialName);
  const [roleTitle, setRoleTitle] = useState(initialRole);
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [expYears, setExpYears] = useState(String(initialExp));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Nama tidak boleh kosong."); return; }
    if (!expYears || Number(expYears) < 0) { toast.error("Pengalaman harus berupa angka valid."); return; }
    onSave({ name, roleTitle, specialty, experienceYears: Number(expYears) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-[460px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-700 text-xl">manage_accounts</span>
            Ubah Profil Mitra
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Nama Lengkap", icon: <User className="h-3.5 w-3.5 text-slate-400" />, value: name, onChange: setName, type: "text", placeholder: "Nama lengkap Anda" },
            { label: "Gelar / Peran (Role)", icon: <Briefcase className="h-3.5 w-3.5 text-slate-400" />, value: roleTitle, onChange: setRoleTitle, type: "text", placeholder: "cth. Psikolog Klinis" },
            { label: "Fokus / Spesialisasi", icon: <Briefcase className="h-3.5 w-3.5 text-slate-400" />, value: specialty, onChange: setSpecialty, type: "text", placeholder: "cth. Kecemasan & Depresi" },
            { label: "Pengalaman (Tahun)", icon: <Award className="h-3.5 w-3.5 text-slate-400" />, value: expYears, onChange: setExpYears, type: "number", placeholder: "cth. 5" },
          ].map((f) => (
            <div key={f.label}>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                {f.icon} {f.label}
              </label>
              <input
                type={f.type}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                placeholder={f.placeholder}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4 border-t border-slate-50 mt-2">
            <button type="button" onClick={onClose} disabled={isPending}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 rounded-xl bg-[#0D1B2A] hover:bg-[#1A8A7A] py-2.5 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2">
              {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Phone OTP ─────────────────────────────────────────────────────────
function PhoneModal({
  initialPhone,
  onClose,
  onVerified,
}: {
  initialPhone: string;
  onClose: () => void;
  onVerified: (phone: string) => void;
}) {
  const [step, setStep] = useState<"input" | "verify">("input");
  const [phone, setPhone] = useState(initialPhone);
  const [otpCode, setOtpCode] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const sendOtp = useSendPsychologistOtp();
  const verifyOtp = useVerifyPsychologistOtp();

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null); setDemoCode(null);
    if (!phone.trim()) { setError("Nomor telepon tidak boleh kosong."); return; }
    const tid = toast.loading("Mengirim kode verifikasi OTP...");
    sendOtp.mutate(phone.trim(), {
      onSuccess: (res: any) => {
        setStep("verify"); setCooldown(60);
        if (res.formattedPhone) setPhone(res.formattedPhone);
        if (res.mocked && res.code) { setDemoCode(res.code); toast.info(`[Demo] OTP: ${res.code}`, { id: tid, duration: 8000 }); }
        else toast.success("Kode verifikasi terkirim!", { id: tid });
      },
      onError: (err: any) => { setError(err.message); toast.error(err.message, { id: tid }); },
    });
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!otpCode.trim()) { setError("Kode OTP tidak boleh kosong."); return; }
    const tid = toast.loading("Memverifikasi nomor...");
    verifyOtp.mutate({ phoneNumber: phone, otpCode: otpCode.trim() }, {
      onSuccess: () => { toast.success("Nomor telepon berhasil diverifikasi!", { id: tid }); onVerified(phone); },
      onError: (err: any) => { setError(err.message); toast.error(err.message, { id: tid }); },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-[400px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-700 text-xl">contact_phone</span>
            {step === "input" ? "Verifikasi Nomor Telepon" : "Masukkan Kode OTP"}
          </h3>
          <button onClick={onClose} disabled={sendOtp.isPending || verifyOtp.isPending}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 border border-rose-100/50 text-rose-600">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        )}

        {step === "input" ? (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Nomor Telepon Baru</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789 atau +62..."
                disabled={sendOtp.isPending}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25" />
              <p className="text-[10px] text-slate-400 mt-1">Kode OTP dikirim via WhatsApp/SMS.</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <button type="button" onClick={onClose} disabled={sendOtp.isPending}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">Batal</button>
              <button type="submit" disabled={sendOtp.isPending}
                className="flex-1 rounded-xl bg-[#0D1B2A] hover:bg-[#1A8A7A] py-2.5 text-xs font-bold text-white cursor-pointer flex items-center justify-center gap-2">
                {sendOtp.isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><Send className="h-3 w-3" /> Kirim OTP</>}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-slate-500 space-y-1">
              <p className="text-xs font-medium">Kode verifikasi dikirim ke:</p>
              <p className="text-sm font-bold text-slate-700">{phone}</p>
            </div>
            {demoCode && (
              <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-3 flex items-center gap-2 text-teal-700">
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                <p className="text-[11px] font-semibold">[Demo Mode] OTP: <span className="font-mono text-xs font-black tracking-widest text-teal-900">{demoCode}</span></p>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-500">Kode Verifikasi (6 Digit)</label>
              <input type="text" value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                placeholder="......" maxLength={6} autoFocus
                disabled={verifyOtp.isPending}
                className="w-full text-center tracking-widest font-mono text-lg font-black rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25" />
            </div>
            <div className="text-center">
              {cooldown > 0
                ? <span className="text-[11px] font-semibold text-slate-400">Kirim ulang dalam <strong className="text-slate-500">{cooldown}s</strong></span>
                : <button type="button" onClick={() => handleSend()} disabled={sendOtp.isPending}
                    className="text-[11px] font-extrabold text-teal-700 hover:underline cursor-pointer">Kirim ulang kode</button>}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-50">
              <button type="button" onClick={() => setStep("input")} disabled={verifyOtp.isPending}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">Kembali</button>
              <button type="submit" disabled={verifyOtp.isPending}
                className="flex-1 rounded-xl bg-[#0D1B2A] hover:bg-[#1A8A7A] py-2.5 text-xs font-bold text-white cursor-pointer flex items-center justify-center gap-2">
                {verifyOtp.isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Verifikasi & Simpan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Modal: Change Password ────────────────────────────────────────────────────
function PasswordModal({ userEmail, onClose }: { userEmail: string; onClose: () => void }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updatePassword = useUpdatePsychologistPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    if (!current) { setError("Password saat ini wajib diisi."); return; }
    if (!next || next.length < 6) { setError("Password baru minimal 6 karakter."); return; }
    if (next !== confirm) { setError("Konfirmasi password tidak cocok."); return; }
    const tid = toast.loading("Memperbarui kata sandi...");
    updatePassword.mutate({ currentPassword: current, newPassword: next }, {
      onSuccess: () => { toast.success("Kata sandi berhasil diperbarui!", { id: tid }); onClose(); },
      onError: (err: any) => { const msg = err.message || "Gagal memperbarui kata sandi."; setError(msg); toast.error(msg, { id: tid }); },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-[420px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-700 text-xl">shield_lock</span>
            Ubah Kata Sandi
          </h3>
          <button onClick={onClose} disabled={updatePassword.isPending}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 border border-rose-100/50 text-rose-600">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Kata Sandi Saat Ini", value: current, onChange: setCurrent, extra: (
              <button type="button" onClick={() => { onClose(); router.push(`/forgot-password?email=${encodeURIComponent(userEmail)}`); }}
                className="text-[10px] font-bold text-teal-700 hover:underline cursor-pointer">Lupa password?</button>
            )},
            { label: "Kata Sandi Baru", value: next, onChange: setNext },
            { label: "Konfirmasi Kata Sandi Baru", value: confirm, onChange: setConfirm },
          ].map((f, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-400" /> {f.label}
                </label>
                {f.extra}
              </div>
              <input type="password" value={f.value} onChange={(e) => f.onChange(e.target.value)}
                disabled={updatePassword.isPending}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25" />
            </div>
          ))}
          <div className="flex gap-3 pt-4 border-t border-slate-50 mt-2">
            <button type="button" onClick={onClose} disabled={updatePassword.isPending}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">Batal</button>
            <button type="submit" disabled={updatePassword.isPending}
              className="flex-1 rounded-xl bg-[#0D1B2A] hover:bg-[#1A8A7A] py-2.5 text-xs font-bold text-white cursor-pointer flex items-center justify-center gap-2">
              {updatePassword.isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Ubah Sandi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Account settings card (inline) ──────────────────────────────────────────
function AccountSettingsCard({ onUpdatePassword }: { onUpdatePassword: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center gap-2">
        <Settings className="h-4 w-4 text-slate-400" />
        <h2 className="text-base font-bold text-slate-800">Pengaturan Akun</h2>
      </div>
      <button type="button" onClick={onUpdatePassword}
        className="flex items-center justify-between rounded-xl px-1 py-1 text-left transition-colors cursor-pointer hover:text-teal-700 group w-full">
        <span className="flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors group-hover:text-teal-700">
          <ShieldCheck className="h-4 w-4 text-slate-400 transition-colors group-hover:text-teal-700" />
          Ubah Kata Sandi
        </span>
        <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-teal-700" />
      </button>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export default function PsychologistProfileClient() {
  const { data, isLoading } = usePsychologistProfile();
  const updateProfile = useUpdatePsychologistProfile();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
      </div>
    );
  }

  const { user, profile, consultationHistory, sessionTrends, metrics } = data;

  const handleSaveProfile = (payload: UpdatePsychologistProfilePayload) => {
    const tid = toast.loading("Memperbarui profil...");
    updateProfile.mutate(payload, {
      onSuccess: () => { toast.success("Profil berhasil diperbarui!", { id: tid }); setProfileModalOpen(false); },
      onError: (err: any) => toast.error(err.message || "Gagal memperbarui profil.", { id: tid }),
    });
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
      {/* ── Upper Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <PsychologistProfileCard
            user={user}
            profile={profile}
            onEdit={() => setProfileModalOpen(true)}
          />
          <AccountSettingsCard onUpdatePassword={() => setPasswordModalOpen(true)} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <PsychologistPersonalInfoCard
            user={user}
            profile={profile}
            onEditPhone={() => setPhoneModalOpen(true)}
          />
        </div>
      </div>

      {/* ── Trends Chart ── */}
      <ConsultationTrendsCard trends={sessionTrends} metrics={metrics} />

      {/* ── Session History ── */}
      <PsychologistConsultationHistoryCard items={consultationHistory} />

      {/* ── Modals ── */}
      {profileModalOpen && (
        <EditProfileModal
          initialName={user.name}
          initialRole={profile.role}
          initialSpecialty={profile.specialty}
          initialExp={profile.experienceYears}
          onClose={() => setProfileModalOpen(false)}
          onSave={handleSaveProfile}
          isPending={updateProfile.isPending}
        />
      )}
      {phoneModalOpen && (
        <PhoneModal
          initialPhone={user.kontakDarurat || ""}
          onClose={() => setPhoneModalOpen(false)}
          onVerified={() => setPhoneModalOpen(false)}
        />
      )}
      {passwordModalOpen && (
        <PasswordModal
          userEmail={user.email}
          onClose={() => setPasswordModalOpen(false)}
        />
      )}
    </main>
  );
}
