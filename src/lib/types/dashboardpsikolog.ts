export interface TodayConsultation {
  id: string;
  clientName: string;
  clientRole: string;
  clientImage: string;
  schedule: string;
  status: "Berlangsung" | "Terjadwal";
}

export interface ConsultationHistoryItem {
  id: string;
  psychologName: string;
  psychologInitials: string;
  date: string;
  status: "Selesai" | "Dijadwalkan" | "Dibatalkan";
}

export interface ScreeningResult {
  label: string;
  value: string;
  level: "Rendah" | "Sedang" | "Tinggi";
}

export interface ClientItem {
  id: string;
  name: string;
  role: string;
  image: string;
  priority: "Prioritas Tinggi" | "Prioritas Rendah" | "Prioritas Sedang";
  mood: string;
  trend: string;
  screeningResults: ScreeningResult[];
  aiSummary: string[];
}