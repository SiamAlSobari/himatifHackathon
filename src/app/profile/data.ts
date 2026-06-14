// DUMMY


import {
  ConsultationHistoryItem,
  MedicalDocument,
  QuickHelpLink,
} from "@/lib/types/profile";
import { FooterLinkGroup } from "@/lib/types/dashboard";

export const quickHelpLinks: QuickHelpLink[] = [
  { id: "help-1", label: "Pusat Bantuan", href: "/bantuan", variant: "default" },
  { id: "help-2", label: "Kontak Darurat (119)", href: "tel:119", variant: "danger" },
];

export const consultationHistory: ConsultationHistoryItem[] = [
  {
    id: "consult-1",
    psychologistName: "Dr. Dian Paramita",
    psychologistInitials: "DP",
    date: "12 Jan 2024",
    status: "Selesai",
  },
  {
    id: "consult-2",
    psychologistName: "Budi Santoso, M.Psi",
    psychologistInitials: "BS",
    date: "05 Jan 2024",
    status: "Selesai",
  },
  {
    id: "consult-3",
    psychologistName: "Rina Larasati, M.Psi",
    psychologistInitials: "RL",
    date: "28 Des 2023",
    status: "Selesai",
  },
];

export const medicalDocuments: MedicalDocument[] = [
  {
    id: "doc-1",
    title: "Catatan Sesi - 12 Jan",
    meta: "PDF • 1.2 MB",
    fileType: "pdf",
  },
  {
    id: "doc-2",
    title: "Rekomendasi Terapi",
    meta: "DOCX • 0.8 MB",
    fileType: "docx",
  },
  {
    id: "doc-3",
    title: "Hasil Assessment",
    meta: "PDF • 2.5 MB",
    fileType: "pdf",
  },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Layanan",
    links: [
      { label: "Home", href: "/" },
      { label: "Kenali", href: "/kenali" },
      { label: "Validasi", href: "/validasi" },
      { label: "Arahkan", href: "/arahkan" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Dukungan",
    links: [
      { label: "Pusat Bantuan", href: "/bantuan" },
      { label: "Kebijakan Privasi", href: "/privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat" },
      { label: "Kontak Kami", href: "/kontak" },
    ],
  },
];