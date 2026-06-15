"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { screeningQuestions, answerOptions } from "@/lib/constants/questions";

// Custom styles that mimic the provided HTML styling configuration
const colors = {
  primary: "#004349",
  primaryContainer: "#0d5c63",
  surface: "#f8f9ff",
  onSurface: "#0b1c30",
  secondary: "#b9003e",
  surfaceContainerLow: "#eff4ff",
  urgentBg: "#FCE6ED",
  outlineVariant: "#bfc8c9",
};

interface ScreeningClientProps {
  isOnboarded: boolean;
  alreadyScreenedToday: boolean;
  latestScreening: {
    score: number;
    createdAt: string;
    type: string;
  } | null;
  userProfile: {
    name: string;
    usia: number | null;
    jenisKelamin: string | null;
  };
}

const moodOptions = [
  {
    id: "sangat-baik",
    icon: "sentiment_very_satisfied",
    title: "Sangat Baik",
    description: "Merasa produktif dan tenang.",
  },
  {
    id: "baik",
    icon: "sentiment_satisfied",
    title: "Baik",
    description: "Kondisi stabil dan terkendali.",
  },
  {
    id: "biasa-saja",
    icon: "sentiment_neutral",
    title: "Biasa Saja",
    description: "Tidak ada perubahan signifikan.",
  },
  {
    id: "kurang-baik",
    icon: "sentiment_dissatisfied",
    title: "Kurang Baik",
    description: "Merasa sedikit cemas atau lelah.",
  },
  {
    id: "sangat-buruk",
    icon: "sentiment_very_dissatisfied",
    title: "Sangat Buruk",
    description: "Membutuhkan bantuan segera.",
  },
  {
    id: "lainnya",
    icon: "psychology_alt",
    title: "Lainnya",
    description: "Sulit mendefinisikan perasaan.",
  },
];

export default function ScreeningClient({
  isOnboarded,
  alreadyScreenedToday,
  latestScreening,
  userProfile,
}: ScreeningClientProps) {
  const router = useRouter();

  // Navigation states:
  // Step 1: Mood Selector
  // Step 2-5: Q1-Q4
  const [step, setStep] = useState<number>(1);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalSteps = 5; // Mood (1) + Q1-Q4 (4) = 5 steps

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleAnswerSelect = (qNumber: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [qNumber]: score,
    }));
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!selectedMood) {
        alert("Silakan pilih salah satu perasaan Anda terlebih dahulu.");
        return;
      }
      setStep(2);
      return;
    }

    const currentQ = screeningQuestions[step - 2];
    const currentAnswer = answers[currentQ.qNumber];

    if (currentAnswer === undefined) {
      alert("Silakan pilih salah satu opsi jawaban terlebih dahulu.");
      return;
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      // Last step: Submit the screening
      await handleSubmit();
    }
  };

  const handleBack = () => {
    // Onboarding users cannot exit/go back past step 1
    if (step === 1) {
      if (isOnboarded) {
        router.push("/dashboard");
      }
      return;
    }
    setStep((prev) => prev - 1);
  };

  const handleSaveForLater = () => {
    if (isOnboarded) {
      router.push("/dashboard");
    }
  };

  const handleSubmit = async () => {
    setLoading(false);
    setErrorMsg(null);

    // Map responses to payload
    const formattedAnswers = [
      { qNumber: 0, score: moodOptions.findIndex(m => m.id === selectedMood) }, // store mood choice as qNumber 0
      ...screeningQuestions.map((q) => ({
        qNumber: q.qNumber,
        score: answers[q.qNumber] ?? 0,
      })),
    ];

    try {
      setLoading(true);
      const screeningType = isOnboarded ? "DAILY" : "ONBOARDING";

      const res = await fetch("/api/screening", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: screeningType,
          answers: formattedAnswers.filter((a) => a.qNumber > 0), // exclude mood from scoring
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan hasil screening.");
      }

      // Successful screening
      if (screeningType === "ONBOARDING") {
        router.push("/chat"); // onboarding directs straight to chatbot
      } else {
        router.push("/dashboard"); // daily directs back to dashboard
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  // Cooldown screen for onboarded users who already completed daily screening today
  if (alreadyScreenedToday && isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 font-body-md antialiased text-on-surface">
        <Navbar userName={userProfile.name} isOnboarded={true} />
        <main className="mx-auto max-w-xl px-6 pt-24 pb-32 text-center">
          <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-xl shadow-[#0D1B2A]/5 md:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#f0f7f8] text-[#0d5c63]">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#004349] leading-tight mb-4">
              Daily Screening Selesai!
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              Halo <span className="font-bold text-slate-800">{userProfile.name}</span>, Anda sudah menyelesaikan screening harian hari ini. Terima kasih telah memantau kesehatan mental Anda. Kembali lagi besok ya!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 bg-[#004349] text-white font-medium rounded-lg active:scale-95 transition-all hover:bg-[#004349]/90 shadow-md shadow-[#004349]/10"
              >
                Kembali ke Dashboard
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="w-full py-3.5 border-2 border-[#0d5c63] text-[#0d5c63] font-medium rounded-lg active:scale-95 transition-all hover:bg-slate-50"
              >
                Mulai Sesi Curhat AI
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Active question mappings
  const isMoodStep = step === 1;
  const currentQuestion = !isMoodStep ? screeningQuestions[step - 2] : null;
  const progressPercent = (step / totalSteps) * 100;

  // Formatting strings based on Onboarding vs Daily
  const screeningTitle = isOnboarded ? "Daily Screening" : "Onboarding Screening";
  const screeningSubtitle = isOnboarded
    ? "Bantu kami memantau kondisi emosional harian Anda untuk memberikan coping mechanism terbaik."
    : "Mulailah perjalanan kesehatan mental Anda dengan screening dasar untuk menyesuaikan nuansa platform.";

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-body-md antialiased">
      {/* Styles applied inline to match static reference rules */}
      <style jsx global>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .active-card {
          border-color: #0d5c63 !important;
          background-color: #f0f7f8 !important;
          box-shadow: 0px 8px 16px rgba(13, 92, 99, 0.08) !important;
        }
        .stepper-progress {
          transition: width 0.8s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .mood-card:hover:not(.active-card) {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Top Navbar */}
      <Navbar userName={userProfile.name} isOnboarded={isOnboarded} />

      <main className="mx-auto max-w-7xl px-6 pt-24 pb-32 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Stepper */}
            <div className="mb-12">
              <div className="mb-3 flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-[#004349] uppercase tracking-wider mb-1">
                    {screeningTitle}
                  </span>
                  <span className="font-semibold text-sm text-[#3f484a]">
                    Langkah {step} dari {totalSteps}
                  </span>
                </div>
                <span className="text-xs text-[#6f797a] bg-[#eff4ff] px-3 py-1 rounded-full font-medium">
                  Kesehatan Mental
                </span>
              </div>
              <div className="w-full h-1 bg-[#bfc8c9]/30 rounded-full overflow-hidden">
                <div
                  className="stepper-progress h-full bg-[#004349]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            {/* Question Header */}
            <div className="mb-10 text-center lg:text-left">
              <h1 className="font-serif text-2xl font-bold md:text-3xl text-[#004349] mb-4 leading-tight">
                {isMoodStep
                  ? "Bagaimana perasaan Anda hari ini?"
                  : currentQuestion?.text}
              </h1>
              <p className="text-sm text-[#3f484a] max-w-2xl leading-relaxed">
                {isMoodStep
                  ? "Pilih satu yang paling menggambarkan keadaan emosional Anda saat ini untuk membantu kami memberikan rekomendasi yang tepat."
                  : "Jawablah sejujur-jujurnya sesuai dengan keadaan Anda dalam dua minggu terakhir ini."}
              </p>
            </div>

            {/* Options grid */}
            {isMoodStep ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="mood-grid">
                {moodOptions.map((opt) => {
                  const isActive = selectedMood === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleMoodSelect(opt.id)}
                      className={`mood-card flex items-center p-5 bg-white border border-[#bfc8c9]/60 rounded-xl text-left transition-all duration-300 group cursor-pointer ${
                        isActive ? "active-card" : ""
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                          isActive ? "bg-[#abeef6]" : "bg-[#eff4ff]"
                        } group-hover:bg-[#abeef6]`}
                      >
                        <span
                          className="material-symbols-outlined text-[#004349] text-2xl"
                          style={{
                            fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          {opt.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[#0b1c30] mb-0.5">
                          {opt.title}
                        </p>
                        <p className="text-xs text-[#6f797a] leading-tight">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {answerOptions.map((opt, idx) => {
                  const isActive = answers[currentQuestion!.qNumber] === opt.score;
                  const icons = [
                    "sentiment_very_satisfied",
                    "sentiment_satisfied",
                    "sentiment_dissatisfied",
                    "sentiment_very_dissatisfied",
                  ];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(currentQuestion!.qNumber, opt.score)}
                      className={`mood-card flex items-center p-5 bg-white border border-[#bfc8c9]/60 rounded-xl text-left transition-all duration-300 group cursor-pointer ${
                        isActive ? "active-card" : ""
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors ${
                          isActive ? "bg-[#abeef6]" : "bg-[#eff4ff]"
                        } group-hover:bg-[#abeef6]`}
                      >
                        <span
                          className="material-symbols-outlined text-[#004349] text-2xl"
                          style={{
                            fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          {icons[idx]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[#0b1c30] mb-0.5">
                          {opt.text}
                        </p>
                        <p className="text-xs text-[#6f797a] leading-tight">
                          Nilai skor: {opt.score}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Actions button area */}
            <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-start">
              {/* Back button (Only visible to onboarded users at step 1, or steps 2+) */}
              {(step > 1 || isOnboarded) && (
                <button
                  onClick={handleBack}
                  className="w-full sm:w-48 py-4 border-2 border-[#0d5c63] text-[#0d5c63] font-medium rounded-lg active:scale-95 transition-all hover:bg-slate-50 cursor-pointer"
                >
                  {step === 1 ? "Kembali ke Dashboard" : "Langkah Sebelumnya"}
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:w-64 py-4 bg-[#004349] text-white font-semibold rounded-lg active:scale-95 transition-all shadow-[0px_4px_12px_rgba(0,67,73,0.2)] hover:bg-[#004349]/90 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {step === totalSteps ? "Selesaikan Screening" : "Lanjutkan"}
              </button>

              {/* Save for later only shown if user is already onboarded */}
              {isOnboarded && (
                <button
                  onClick={handleSaveForLater}
                  className="w-full sm:w-48 py-4 border border-[#bfc8c9] text-slate-500 font-medium rounded-lg active:scale-95 transition-all hover:bg-slate-50 cursor-pointer"
                >
                  Simpan untuk Nanti
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Trust Card */}
            <div className="bg-white p-7 rounded-2xl border border-[#bfc8c9]/40 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#0d5c63]/10 rounded-lg">
                  <span
                    className="material-symbols-outlined text-[#0d5c63] block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold text-[#0b1c30] leading-tight">
                  Mengapa Screening ini Penting?
                </h2>
              </div>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span
                    className="material-symbols-outlined text-[#0d5c63] text-[20px] shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-[#0b1c30] mb-0.5">Deteksi Dini</p>
                    <p className="text-xs text-[#3f484a] leading-normal">
                      Mengidentifikasi gejala stres atau kecemasan sebelum berkembang lebih jauh.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="material-symbols-outlined text-[#0d5c63] text-[20px] shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-[#0b1c30] mb-0.5">Personalisasi</p>
                    <p className="text-xs text-[#3f484a] leading-normal">
                      Memberikan rekomendasi layanan yang sesuai dengan profil psikologis Anda.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span
                    className="material-symbols-outlined text-[#0d5c63] text-[20px] shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-[#0b1c30] mb-0.5">Kerahasiaan Data</p>
                    <p className="text-xs text-[#3f484a] leading-normal">
                      Seluruh data Anda dienkripsi dan hanya digunakan untuk keperluan medis.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* User Details & Last Screening Card (Replacing Expert Card) */}
            <div className="bg-[#eff4ff]/50 p-6 rounded-2xl border border-[#bfc8c9]/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-[#004349] flex items-center justify-center text-white text-lg font-bold">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs text-[#004349] uppercase tracking-wider font-bold">
                    Profil Pengguna
                  </p>
                  <p className="font-semibold text-sm text-[#0b1c30]">{userProfile.name}</p>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-[#3f484a] leading-relaxed">
                <div>
                  <span className="font-semibold text-slate-700">Usia:</span>{" "}
                  {userProfile.usia ? `${userProfile.usia} Tahun` : "-"}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Jenis Kelamin:</span>{" "}
                  {userProfile.jenisKelamin === "L" ? "Laki-laki" : userProfile.jenisKelamin === "P" ? "Perempuan" : "-"}
                </div>
                <div className="border-t border-slate-200/60 pt-2.5 mt-2.5">
                  <p className="font-bold text-[#004349] mb-1">Status Riwayat</p>
                  {latestScreening ? (
                    <>
                      <p>
                        <span className="font-semibold">Skor Terakhir:</span> {latestScreening.score} / 12
                      </p>
                      <p>
                        <span className="font-semibold">Tanggal:</span>{" "}
                        {new Date(latestScreening.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p>
                        <span className="font-semibold">Tipe:</span>{" "}
                        {latestScreening.type === "ONBOARDING" ? "Onboarding" : "Harian"}
                      </p>
                    </>
                  ) : (
                    <p className="italic text-slate-400">Belum ada riwayat screening sebelumnya.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-[#FCE6ED]/40 p-6 rounded-2xl border border-[#b9003e]/10">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="material-symbols-outlined text-[#b9003e]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  emergency
                </span>
                <h2 className="font-semibold text-sm text-[#b9003e] uppercase tracking-wide">
                  Bantuan Segera
                </h2>
              </div>
              <p className="text-xs text-[#3f484a] mb-5 leading-relaxed">
                Jika Anda merasa dalam bahaya atau memerlukan intervensi krisis mendesak.
              </p>
              <button
                onClick={() => window.open("tel:119")}
                className="w-full py-3.5 bg-[#b9003e] text-white font-semibold text-xs rounded-lg active:scale-95 transition-all hover:bg-[#b9003e]/90 shadow-sm cursor-pointer"
              >
                Hubungi Crisis Center (119)
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
