"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRequestPasswordReset } from "@/hooks/profile/useProfile";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email") || "";
  
  const resetRequestMutation = useRequestPasswordReset();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetLink(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg("Alamat email tidak boleh kosong.");
      return;
    }

    resetRequestMutation.mutate(cleanEmail, {
      onSuccess: (res) => {
        setIsSuccess(true);
        toast.success("Link reset password berhasil dikirim!");
        if (res.mocked && res.resetLink) {
          setResetLink(res.resetLink);
        }
      },
      onError: (err: any) => {
        setErrorMsg(err.message || "Gagal mengirim link reset password.");
      },
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl relative overflow-hidden transition-all duration-300">
        
        {/* Glow circles */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10">
          {/* Back button */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke Login
          </Link>

          {!isSuccess ? (
            <>
              {/* Info Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Lupa Kata Sandi?</h2>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
                  Jangan khawatir, kami akan membantu Anda menyetel ulang kata sandi. Masukkan email terdaftar Anda di bawah ini.
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
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                    disabled={resetRequestMutation.isPending}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-primary/5"
                  disabled={resetRequestMutation.isPending}
                >
                  {resetRequestMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Kirim Link Reset
                      <Send className="h-3.5 w-3.5" />
                    </>
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
              <h2 className="text-lg font-bold text-slate-800">Email Terkirim</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                Tautan untuk mengatur ulang kata sandi Anda telah dikirim ke <strong className="text-slate-600 font-bold">{email}</strong>. Silakan periksa kotak masuk atau spam Anda.
              </p>

              {/* Demo Assist Box */}
              {resetLink && (
                <div className="mt-6 rounded-2xl bg-teal-50 border border-teal-100 p-4 text-left space-y-2 animate-scale-in">
                  <p className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Mode Demo / Simulasi Email
                  </p>
                  <p className="text-[10px] text-teal-600 leading-relaxed font-medium">
                    Karena ini adalah lingkungan hackathon, tautan verifikasi reset di-print di terminal server. Klik tombol di bawah untuk langsung memverifikasi.
                  </p>
                  <button
                    onClick={() => router.push(resetLink)}
                    className="w-full mt-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2 transition-all cursor-pointer"
                  >
                    Buka Halaman Reset Kata Sandi
                  </button>
                </div>
              )}

              <Link
                href="/login"
                className="mt-6 inline-block text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Kembali ke halaman masuk
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
