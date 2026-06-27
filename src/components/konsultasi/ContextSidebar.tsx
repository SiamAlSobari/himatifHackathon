"use client";

import React from "react";

interface Psychologist {
  name: string;
  role: string;
  imageUrl: string;
  experienceYears: number;
  specialty: string;
  strNumber?: string;
  practiceLocation?: string;
}

interface ContextSidebarProps {
  durationString: string;
  onEndSession: () => void;
  psychologist: Psychologist;
  latestScreeningScore: number | null;
  complaints?: string[];
  patientQuote?: string;
  isSessionStarted?: boolean;
}

export default function ContextSidebar({
  durationString,
  onEndSession,
  psychologist,
  latestScreeningScore,
  complaints = ["Insomnia", "Overthinking", "Palpitasi"],
  patientQuote = '"Sering merasa dunia akan berakhir jika melakukan kesalahan kecil."',
  isSessionStarted,
}: ContextSidebarProps) {
  // Derive score presentation from screening score (max 12 from constants)
  const scoreVal = latestScreeningScore !== null ? latestScreeningScore : 9;
  const scoreMax = 12;
  const percentage = Math.min(100, Math.round((scoreVal / scoreMax) * 100));

  // Determine category
  let categoryLabel = "Rendah";
  let colorClass = "bg-green-500 text-green-600";
  
  if (scoreVal > 9) {
    categoryLabel = "Tinggi";
    colorClass = "bg-secondary text-secondary";
  } else if (scoreVal > 5) {
    categoryLabel = "Sedang";
    colorClass = "bg-amber-500 text-amber-600";
  }

  const defaultStr = psychologist.strNumber || "STR: 12.34.5.6.78.91011";
  const defaultPractice = psychologist.practiceLocation || "Praktek: RS Medika Utama";

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
          type="button"
          disabled={!isSessionStarted}
          className="w-full py-3 bg-urgent-bg text-secondary font-bold rounded-lg border border-secondary/20 hover:bg-[#b9003e] hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-lg">close</span>
          Akhiri Sesi
        </button>
      </div>

      {/* Psychologist Profile Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden soft-bloom">
        <div className="h-20 bg-primary-container relative">
          <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
            <img
              className="w-20 h-20 rounded-full object-cover border border-slate-100"
              alt={psychologist.name}
              src={psychologist.imageUrl}
            />
          </div>
        </div>
        <div className="pt-12 p-6">
          <h3 className="font-headline-md text-body-lg text-primary">{psychologist.name}</h3>
          <p className="text-on-surface-variant font-label-md mt-1">{psychologist.role}</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
              <span className="text-body-sm">{defaultStr}</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">work</span>
              <span className="text-body-sm">{psychologist.experienceYears}+ Tahun Pengalaman</span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-sm">location_on</span>
              <span className="text-body-sm">{defaultPractice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History / Screening Context */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 soft-bloom">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <h3 className="font-headline-md text-body-md text-primary">Konteks Skrining</h3>
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
                className={`h-1.5 rounded-full origin-left animate-progress ${scoreVal > 9 ? "bg-secondary" : scoreVal > 5 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-label-md font-bold text-on-surface-variant">Keluhan Utama:</h4>
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
          <div className="pt-2 border-t border-outline-variant">
            <p className="text-body-sm text-on-surface-variant italic">{patientQuote}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
