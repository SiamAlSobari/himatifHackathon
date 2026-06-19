import { TodayConsultation, ConsultationHistoryItem, ClientItem } from "@/lib/types/dashboardpsikolog";

export const todayConsultations: TodayConsultation[] = [
  {
    id: "1",
    clientName: "Xontl",
    clientRole: "Pekerja X Komersial",
    clientImage: "/images/clients/xontl.jpg",
    schedule: "Video Call · 10:00 - 11.30",
    status: "Berlangsung",
  },
  {
    id: "2",
    clientName: "Kagfka",
    clientRole: "Kecoa",
    clientImage: "/images/clients/kagfka.jpg",
    schedule: "Video Call · 13:00 - 14.00",
    status: "Terjadwal",
  },
];


export const clientList: ClientItem[] = [
  {
    id: "1",
    name: "Anton",
    role: "Pekerja 23 Tahun",
    image: "/images/clients/anton.jpg",
    priority: "Prioritas Tinggi",
    mood: "Rendah",
    trend: "Menurun",
    screeningResults: [
      { label: "Kecemasan (GAD-7)", value: "Rendah", level: "Rendah" },
      { label: "Stres (PSS)", value: "Sedang", level: "Sedang" },
    ],
    aiSummary: [
      "Stres ringan akibat pekerjaan dan tekanan hidup",
      "Kurang tidur karena stres",
      "Kurang makan karena stres",
    ],
  },
  {
    id: "2",
    name: "Fiky",
    role: "Wibu 40 Tahun",
    image: "/images/clients/fiky.jpg",
    priority: "Prioritas Rendah",
    mood: "Sedang",
    trend: "Stabil",
    screeningResults: [
      { label: "Kecemasan (GAD-7)", value: "Sedang", level: "Sedang" },
      { label: "Stres (PSS)", value: "Rendah", level: "Rendah" },
    ],
    aiSummary: [
      "Kondisi emosional relatif stabil minggu ini",
      "Tidak ada keluhan tidur yang signifikan",
      "Pola makan dalam batas normal",
    ],
  },
  {
    id: "3",
    name: "Anton",
    role: "Pekerja 23 Tahun",
    image: "/images/clients/anton.jpg",
    priority: "Prioritas Tinggi",
    mood: "Rendah",
    trend: "Menurun",
    screeningResults: [
      { label: "Kecemasan (GAD-7)", value: "Rendah", level: "Rendah" },
      { label: "Stres (PSS)", value: "Sedang", level: "Sedang" },
    ],
    aiSummary: [
      "Stres ringan akibat pekerjaan dan tekanan hidup",
      "Kurang tidur karena stres",
      "Kurang makan karena stres",
    ],
  },
];