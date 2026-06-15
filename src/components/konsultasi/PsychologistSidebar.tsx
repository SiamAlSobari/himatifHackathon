"use client";

import React from "react";

interface ClientProfile {
  name: string;
  image?: string;
  email: string;
  usia?: number | null;
  jenisKelamin?: string | null;
}

interface PsychologistSidebarProps {
  durationString: string;
  onEndSession: () => void;
  client: ClientProfile;
  latestScreeningScore: number | null;
  complaints?: string[];
  finalConclusion: string | null;
}

export default function PsychologistSidebar({
  durationString,
  onEndSession,
  client,
  latestScreeningScore,
  complaints = ["Insomnia", "Overthinking", "Palpitasi"],
  finalConclusion,
}: PsychologistSidebarProps) {
  // Derive score presentation from screening score (max 12 from constants)
  const scoreVal = latestScreeningScore !== null ? latestScreeningScore : 9;
  const scoreMax = 12;
  const percentage = Math.min(100, Math.round((scoreVal / scoreMax) * 100));

  // Determine category
  let categoryLabel = "Rendah";
  
  if (scoreVal > 9) {
    categoryLabel = "Tinggi";
  } else if (scoreVal > 5) {
    categoryLabel = "Sedang";
  }

  const ageStr = client.usia ? `${client.usia} Tahun` : "Usia: -";
  const genderStr = client.jenisKelamin ? client.jenisKelamin : "Gender: -";

  return (
    <aside className="w-full md:w-[360px] space-y-gutter shrink-0">
      {/* Session Status Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 soft-bloom">
        <div className="flex items-center justify-between mb-4">
          <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Durasi Sesi</span>
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined animate-pulse text-sm">schedule</span>
            <span className="font-headline-md text-body-md">{durationString}</span>
          </div>
        </div>
        <button
          onClick={onEndSession}
          className="w-full py-3 bg-urgent-bg text-secondary font-bold rounded-lg border border-secondary/20 hover:bg-[#b9003e] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          Akhiri Sesi
        </button>
      </div>

      {/* Client Profile Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden soft-bloom">
        <div className="h-20 bg-primary-container relative">
          <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
            <img
              className="w-20 h-20 rounded-full object-cover border border-slate-100"
              alt={client.name}
              src={client.image || "https://i.pravatar.cc/80?img=12"}
            />
          </div>
        </div>
        <div className="pt-12 p-6">
          <h3 className="font-headline-md text-body-lg text-primary">{client.name}</h3>
          <p className="text-on-surface-variant font-label-md mt-1">{client.email}</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">cake</span>
              <span className="text-body-sm">{ageStr}</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">wc</span>
              <span className="text-body-sm">{genderStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Summary / Final Conclusion */}
      <div className="bg-surface-container-lowest border border-[#004349]/20 rounded-xl p-6 soft-bloom ring-2 ring-[#004349]/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary">psychology</span>
          <h3 className="font-headline-md text-body-md text-primary">Ringkasan AI Sesi Terakhir</h3>
        </div>
        <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200/50">
          <p className="text-xs text-teal-950/90 leading-relaxed font-body-sm whitespace-pre-wrap">
            {finalConclusion || "Belum ada kesimpulan sesi AI terakhir yang tersimpan untuk klien ini."}
          </p>
        </div>
      </div>

      {/* Medical History / Screening Context */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 soft-bloom">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <h3 className="font-headline-md text-body-md text-primary">Konteks Skrining Klien</h3>
        </div>
        <div className="space-y-4">
          <div className="p-3 bg-surface-subtle rounded-lg border border-outline-variant">
            <div className="flex justify-between items-center mb-2">
              <span className="text-label-sm font-bold text-on-surface">Skor Kecemasan</span>
              <span className={`font-bold text-label-sm ${scoreVal > 9 ? "text-secondary" : scoreVal > 5 ? "text-amber-600" : "text-green-600"}`}>
                {categoryLabel} ({scoreVal}/{scoreMax})
              </span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${scoreVal > 9 ? "bg-secondary" : scoreVal > 5 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-label-md font-bold text-on-surface-variant">Keluhan Utama Klien:</h4>
            <div className="flex flex-wrap gap-2">
              {complaints.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
