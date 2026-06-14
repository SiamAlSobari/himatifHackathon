// DUMMY

export interface ConsultationHistoryItem {
  id: string;
  psychologistName: string;
  psychologistInitials: string;
  date: string;
  status: "Selesai" | "Dibatalkan" | "Berlangsung";
}

export interface MedicalDocument {
  id: string;
  title: string;
  meta: string; // e.g. "PDF • 1.2 MB"
  fileType: "pdf" | "docx";
}

export interface QuickHelpLink {
  id: string;
  label: string;
  href: string;
  variant: "default" | "danger";
}