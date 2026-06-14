export interface MoodDataPoint {
  day: string;
  value: number;
  isToday?: boolean;
}

export interface ScreeningResult {
  label: string;
  status: "Rendah" | "Sedang" | "Tinggi";
  progress: number; // 0 - 100
}

export interface ScheduleItem {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  dateLabel: string;
  locked?: boolean;
}

export interface ActivityRecommendation {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  icon: "meditation" | "journal";
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}