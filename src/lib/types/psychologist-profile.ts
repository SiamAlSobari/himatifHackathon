// ─── Psychologist Profile Types ─────────────────────────────────────────────

export interface PsychologistProfileUser {
  name: string;
  email: string;
  image: string | null;
  kontakDarurat: string | null;
}

export interface PsychologistProfileDetails {
  id: string;
  role: string;
  specialty: string;
  rating: number;
  experienceYears: number;
  imageUrl: string;
  availability: string;
  tags: string[];
  operationalHours: string[];
}

export interface PsychologistConsultationHistoryItem {
  id: string;
  clientName: string;
  clientInitials: string;
  date: string;
  status: "Selesai" | "Dijadwalkan" | "Dibatalkan" | "Kadaluwarsa";
}

export interface PsychologistConsultationTrendItem {
  day: string;        // e.g. "Sen (16/6)"
  sessionCount: number; // number of sessions handled that day
}

export interface PsychologistProfileMetrics {
  totalSessionsHandled: number;
  completedSessions: number;
  rating: number;
  experienceYears: number;
}

export interface PsychologistProfileData {
  user: PsychologistProfileUser;
  profile: PsychologistProfileDetails;
  consultationHistory: PsychologistConsultationHistoryItem[];
  sessionTrends: PsychologistConsultationTrendItem[];
  metrics: PsychologistProfileMetrics;
}

// ─── Edit form types ─────────────────────────────────────────────────────────

export interface UpdatePsychologistProfilePayload {
  name?: string;
  roleTitle?: string;
  specialty?: string;
  experienceYears?: number;
}
