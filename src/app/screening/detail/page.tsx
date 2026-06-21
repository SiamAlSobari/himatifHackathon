"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, ShieldCheck, ClipboardList, Activity, Info, BarChart3 } from "lucide-react";
import { useScreeningHistory, ScreeningHistoryItem } from "@/hooks/screening/useScreening";
import { screeningQuestions, answerOptions } from "@/lib/constants/questions";

export default function ScreeningDetailPage() {
  const session = useSession();
  const router = useRouter();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  // Fetch full screening history
  const { data: history = [], isLoading } = useScreeningHistory();

  // Redirect if unauthorized
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status, router]);

  // Set default selection to the latest screening
  useEffect(() => {
    if (history.length > 0 && !selectedId) {
      setSelectedId(history[0].id);
    }
  }, [history, selectedId]);

  if (session.status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Memuat detail riwayat...</p>
        </div>
      </div>
    );
  }

  if (!session.data?.user) {
    return null;
  }

  const selectedScreening = history.find((s) => s.id === selectedId) || null;

  const formatDate = (dateStr: string, timeOption = false) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...(timeOption && { hour: "2-digit", minute: "2-digit" }),
      });
    } catch {
      return dateStr;
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score <= 4) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score <= 9) return "bg-amber-50 text-amber-700 border-amber-200";
    if (score <= 13) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const getSubscaleColor = (status: "Rendah" | "Sedang" | "Tinggi") => {
    if (status === "Rendah") return "bg-emerald-500";
    if (status === "Sedang") return "bg-amber-500";
    return "bg-rose-500";
  };

  const getAnswerText = (qNumber: number, answers: { qNumber: number; score: number }[]) => {
    const userAns = answers.find((a) => a.qNumber === qNumber);
    if (!userAns) return { text: "Tidak dijawab", score: 0 };
    
    const option = answerOptions.find((opt) => opt.score === userAns.score);
    return {
      text: option?.text || "Tidak dijawab",
      score: userAns.score,
    };
  };

  const handleSelectScreening = (id: string) => {
    setSelectedId(id);
    setMobileView("detail");
  };

  return (
    <main className="h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50/50">
      <div className="flex h-full w-full">
        {/* Left pane: Sidebar list of past screenings */}
        <div
          className={`h-full w-full md:w-80 lg:w-96 shrink-0 border-r border-slate-200 bg-white flex flex-col ${
            mobileView === "detail" ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header & Back Button */}
          <div className="p-4 border-b border-slate-100">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer mb-3 outline-none"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </button>
            <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Riwayat Kenali
            </h1>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center h-48">
                <Calendar className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-500">Tidak ada riwayat</p>
                <p className="text-[10px] text-slate-400 mt-1">Lakukan screening di dashboard untuk memulai pencatatan.</p>
              </div>
            ) : (
              history.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectScreening(item.id)}
                    className={`w-full flex flex-col p-3.5 rounded-xl border text-left outline-none transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 border-primary/20 ring-1 ring-primary/10"
                        : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.type === "ONBOARDING" 
                          ? "bg-purple-50 text-purple-600 border border-purple-100" 
                          : "bg-teal-50 text-teal-600 border border-teal-100"
                      }`}>
                        {item.type === "ONBOARDING" ? "Onboarding" : "Harian"}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreBadgeColor(item.score)}`}>
                        Skor: {item.score} / 21
                      </span>
                    </div>
                    <span className={`text-[13px] font-bold leading-tight ${isSelected ? "text-primary" : "text-slate-800"}`}>
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">
                      {formatDate(item.createdAt)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right pane: Analysis breakdown */}
        <div
          className={`h-full flex-1 min-w-0 flex flex-col ${
            mobileView === "list" ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedScreening ? (
            <div className="flex-1 flex flex-col overflow-hidden bg-white md:bg-transparent">
              {/* Toolbar header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                <button
                  onClick={() => setMobileView("list")}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                    Detail Hasil Screening ({formatDate(selectedScreening.createdAt)})
                  </h2>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    ID Transaksi: {selectedScreening.id}
                  </p>
                </div>
              </div>

              {/* Main Detail content area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
                {/* Composite Score Card */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="space-y-2 text-center md:text-left">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedScreening.type === "ONBOARDING" 
                        ? "bg-purple-50 text-purple-600 border border-purple-100" 
                        : "bg-teal-50 text-teal-600 border border-teal-100"
                    }`}>
                      Tipe: {selectedScreening.type === "ONBOARDING" ? "Onboarding" : "Skrining Harian"}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800">{selectedScreening.category}</h3>
                    <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                      Skor kumulatif dihitung berdasarkan skala klinis GAD-7 (Kecemasan) dan PSS (Stres).
                      Gunakan rincian di bawah untuk mempelajari kondisi kesejahteraan Anda secara mendalam.
                    </p>
                  </div>
                  {/* Gauge indicator */}
                  <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center w-36 h-36">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Skor</p>
                    <p className="text-3xl font-black text-primary mt-1">{selectedScreening.score}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">dari 21 Maks</p>
                  </div>
                </div>

                {/* Subscales Category analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Anxiety Card */}
                  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-4.5 w-4.5 text-primary" />
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sub-skala Kecemasan (GAD-7)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Mengukur tingkat ketegangan emosional, kegelisahan, kekhawatiran berlebih, dan ketakutan tidak berdasar.
                      </p>
                    </div>
                    <div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full ${getSubscaleColor(selectedScreening.anxietyStatus)}`}
                          style={{ width: `${(selectedScreening.anxietyScore / 9) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-500">Skor: {selectedScreening.anxietyScore} / 9</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          selectedScreening.anxietyStatus === "Rendah" ? "bg-emerald-50 text-emerald-600" :
                          selectedScreening.anxietyStatus === "Sedang" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          Kondisi: {selectedScreening.anxietyStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stress Card */}
                  <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4.5 w-4.5 text-primary" />
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Sub-skala Tingkat Stres (PSS)</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Mengukur kelelahan fisik, rasa sedih/depresi, ketidakberdayaan, serta hilangnya minat beraktivitas.
                      </p>
                    </div>
                    <div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full ${getSubscaleColor(selectedScreening.stressStatus)}`}
                          style={{ width: `${(selectedScreening.stressScore / 12) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-500">Skor: {selectedScreening.stressScore} / 12</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          selectedScreening.stressStatus === "Rendah" ? "bg-emerald-50 text-emerald-600" :
                          selectedScreening.stressStatus === "Sedang" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          Kondisi: {selectedScreening.stressStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Breakdown list */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Rincian Tanggapan Kuesioner
                  </h4>
                  <div className="divide-y divide-slate-100">
                    {screeningQuestions.map((q) => {
                      const answer = getAnswerText(q.qNumber, selectedScreening.answers);
                      return (
                        <div key={q.qNumber} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 leading-tight">
                              Langkah {q.qNumber}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {q.text}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                            <span className="text-xs text-slate-600 font-semibold px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                              {answer.text}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                              answer.score === 0 ? "bg-slate-100 text-slate-400" :
                              answer.score === 1 ? "bg-primary/5 text-primary" :
                              answer.score === 2 ? "bg-primary/10 text-primary font-bold" : "bg-primary/20 text-primary font-black"
                            }`}>
                              +{answer.score} Poin
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-8 text-center">
              <ClipboardList className="h-12 w-12 text-slate-300 mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-slate-700">Pilih Data Riwayat</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Silakan pilih salah satu data riwayat screening di sebelah kiri untuk melihat rincian kuesioner.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
