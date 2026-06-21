"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useConfirmPasswordReset } from "@/hooks/profile/useProfile";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const confirmResetMutation = useConfirmPasswordReset();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      setErrorMsg("Link reset password tidak valid. Parameter token atau email hilang.");
    }
  }, [token, email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!token || !email) {
      setErrorMsg("Link reset password tidak valid.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg("Password baru minimal harus 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Konfirmasi password baru tidak cocok.");
      return;
    }

    const toastId = toast.loading("Memperbarui kata sandi Anda...");

    confirmResetMutation.mutate(
      {
        token,
        email,
        newPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Kata sandi berhasil diperbarui!", { id: toastId });
          // Wait 3 seconds, then redirect to login page
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        },
        onError: (err: any) => {
          const errMsg = err.message || "Gagal mengatur ulang kata sandi.";
          setErrorMsg(errMsg);
          toast.error(errMsg, { id: toastId });
        },
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl relative overflow-hidden transition-all duration-300">
        
        {/* Glow circles */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Atur Ulang Sandi</h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                  Sesi aktif untuk <strong className="text-slate-600 font-bold">{email}</strong>. Masukkan kata sandi baru Anda di bawah ini.
                </p>
              </div>

              {/* Error Display */}
              {errorMsg && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 border border-rose-100/50 text-rose-600">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold leading-relaxed">{errorMsg}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password Baru */}
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
                    disabled={confirmResetMutation.isPending || !token || !email}
                    autoFocus
                  />
                </div>

                {/* Konfirmasi Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                    disabled={confirmResetMutation.isPending || !token || !email}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-primary/5"
                  disabled={confirmResetMutation.isPending || !token || !email}
                >
                  {confirmResetMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Ubah Kata Sandi"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-4 border border-emerald-100 animate-pulse">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Sandi Berhasil Diubah</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                Kata sandi baru Anda telah berhasil disimpan di sistem.
              </p>
              
              <div className="mt-6 flex flex-col items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider animate-pulse">
                  Mengarahkan Anda ke halaman login...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
