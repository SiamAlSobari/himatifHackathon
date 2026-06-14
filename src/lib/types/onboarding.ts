export type OnboardingStep = "welcome" | "usia" | "gender" | "emergency" | "goals"

export const ONBOARDING_STEPS: OnboardingStep[] = [
  "welcome",
  "usia",
  "gender",
  "emergency",
  "goals",
]

export const STEP_LABELS: Record<OnboardingStep, string> = {
  welcome: "Perkenalan",
  usia: "Usia",
  gender: "Identitas",
  emergency: "Kontak Darurat",
  goals: "Tujuan Kamu",
}

export const GENDER_OPTIONS = [
  {
    id: "female",
    label: "Perempuan",
    emoji: "🌸",
    description: "Wanita",
  },
  {
    id: "male",
    label: "Laki-laki",
    emoji: "🌿",
    description: "Pria",
  },
  {
    id: "nonbinary",
    label: "Non-biner",
    emoji: "🌈",
    description: "Di luar biner",
  },
  {
    id: "prefer_not_say",
    label: "Lebih baik tidak",
    emoji: "🤍",
    description: "Privasi",
  },
] as const

export const GOAL_OPTIONS = [
  {
    id: "mengenal_diri",
    label: "Mengenal Diri",
    description: "Pahami apa yang aku rasakan",
    emoji: "🔍",
  },
  {
    id: "mengurangi_cemas",
    label: "Redakan Cemas",
    description: "Bantu aku lebih tenang",
    emoji: "🌬️",
  },
  {
    id: "menemukan_cerita",
    label: "Tempat Cerita",
    description: "Ada yang mau aku luapkan",
    emoji: "💬",
  },
  {
    id: "konsultasi_profesional",
    label: "Ngobrol dengan Ahli",
    description: "Aku siap bertemu psikolog",
    emoji: "🤝",
  },
] as const

export const AGE_RANGES = [
  { id: "15-17", label: "15 – 17", range: [15, 17] as [number, number] },
  { id: "18-22", label: "18 – 22", range: [18, 22] as [number, number] },
  { id: "23-27", label: "23 – 27", range: [23, 27] as [number, number] },
  { id: "28-35", label: "28 – 35", range: [28, 35] as [number, number] },
  { id: "36+", label: "36+", range: [36, 100] as [number, number] },
] as const

export type GenderId = (typeof GENDER_OPTIONS)[number]["id"]
export type GoalId = (typeof GOAL_OPTIONS)[number]["id"]
export type AgeRangeId = (typeof AGE_RANGES)[number]["id"]

export type OnboardingFormData = {
  usia: number | null
  jenisKelamin: GenderId | null
  kontakDarurat: string
  tujuan: GoalId | null
}
