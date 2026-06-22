export type PsychologistOnboardingStep = 1 | 2 | 3 | 4;

export const FOCUS_AREAS = [
  "Kecemasan (Anxiety)",
  "Depresi (Depression)",
  "Stres & Burnout",
  "Trauma & PTSD",
  "Relasi & Keluarga",
  "Pengembangan Diri",
  "Kesehatan Mental Remaja"
];

export const EXPERTISE_TAGS = [
  "Trauma", 
  "Depresi", 
  "Kecemasan", 
  "Remaja", 
  "Insomnia", 
  "Overthinking", 
  "Palpitasi", 
  "Luka Batin", 
  "Panic Attack", 
  "Adiksi"
];

export const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "19:00", "20:00"
];

export const themeStyles = {
  calm_blue: {
    bg: "bg-teal-50",
    text: "text-teal-950",
    primary: "bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white", // Adjusted colors to match brand theme better
    accent: "text-teal-600",
    border: "border-teal-200/60",
    badge: "bg-teal-100 text-teal-800",
    accentBg: "bg-teal-500",
    glow: "shadow-teal-100",
    stepActive: "bg-teal-800 text-white",
    cardSelect: "border-teal-500 bg-teal-50/50"
  },
  warm_yellow: {
    bg: "bg-amber-50",
    text: "text-amber-950",
    primary: "bg-[#0D1B2A] hover:bg-amber-700 text-white",
    accent: "text-amber-700",
    border: "border-amber-200/60",
    badge: "bg-amber-100 text-amber-900",
    accentBg: "bg-amber-500",
    glow: "shadow-amber-100",
    stepActive: "bg-amber-700 text-white",
    cardSelect: "border-amber-500 bg-amber-50/50"
  },
  alert_orange: {
    bg: "bg-orange-50",
    text: "text-orange-950",
    primary: "bg-[#0D1B2A] hover:bg-orange-700 text-white",
    accent: "text-orange-700",
    border: "border-orange-200/60",
    badge: "bg-orange-100 text-orange-900",
    accentBg: "bg-orange-500",
    glow: "shadow-orange-100",
    stepActive: "bg-orange-700 text-white",
    cardSelect: "border-orange-500 bg-orange-50/50"
  },
  deep_purple: {
    bg: "bg-indigo-50",
    text: "text-indigo-950",
    primary: "bg-[#0D1B2A] hover:bg-indigo-850 text-white",
    accent: "text-indigo-600",
    border: "border-indigo-200/60",
    badge: "bg-indigo-100 text-indigo-900",
    accentBg: "bg-indigo-500",
    glow: "shadow-indigo-100",
    stepActive: "bg-indigo-800 text-white",
    cardSelect: "border-indigo-500 bg-indigo-50/50"
  }
};
