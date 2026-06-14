
// CUMA DUMMY


import {
  ActivityRecommendation,
  FooterLinkGroup,
  MoodDataPoint,
  ScheduleItem,
  ScreeningResult,
} from "@/lib/types/dashboard";

export const moodData: MoodDataPoint[] = [
  { day: "Sen", value: 35 },
  { day: "Sel", value: 28 },
  { day: "Rab", value: 22 },
  { day: "Kam", value: 78, isToday: true },
  { day: "Jum", value: 40 },
  { day: "Sab", value: 45 },
  { day: "Min", value: 38 },
];

export const screeningResults: ScreeningResult[] = [
  { label: "Kecemasan (GAD-7)", status: "Rendah", progress: 28 },
  { label: "Stres (PSS)", status: "Sedang", progress: 58 },
];

export const scheduleItems: ScheduleItem[] = [
  {
    id: "schedule-1",
    name: "Dr. Sarah Anindita",
    role: "Psikolog Klinis Dewasa",
    avatarUrl: "https://i.pravatar.cc/88?img=47",
    dateLabel: "Besok, 10:00",
  },
  {
    id: "schedule-2",
    name: "Dr. Hendra Wijaya",
    role: "Konseling Karir & Stres",
    avatarUrl: "https://i.pravatar.cc/88?img=33",
    dateLabel: "15 Okt, 14:00",
    locked: true,
  },
];

export const activityRecommendations: ActivityRecommendation[] = [
  {
    id: "activity-1",
    title: "Meditasi Fokus",
    description:
      "Membantu menjernihkan pikiran dan kecemasan berlebihan.",
    ctaLabel: "Mulai 10 Menit",
    icon: "meditation",
  },
  {
    id: "activity-2",
    title: "Journaling Syukur",
    description: "Tuliskan 3 hal yang membuatmu tersenyum hari ini.",
    ctaLabel: "Buka Jurnal",
    icon: "journal",
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