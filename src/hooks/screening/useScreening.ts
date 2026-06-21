import { useQuery } from "@tanstack/react-query";

export interface ScreeningHistoryItem {
  id: string;
  type: "ONBOARDING" | "DAILY";
  score: number;
  answers: { qNumber: number; score: number }[];
  createdAt: string;
  anxietyScore: number;
  anxietyStatus: "Rendah" | "Sedang" | "Tinggi";
  stressScore: number;
  stressStatus: "Rendah" | "Sedang" | "Tinggi";
  category: string;
}

export function useScreeningHistory() {
  return useQuery<ScreeningHistoryItem[]>({
    queryKey: ["screening-history"],
    queryFn: async () => {
      const res = await fetch("/api/screening");
      if (!res.ok) throw new Error("Gagal memuat riwayat screening");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal memuat riwayat screening");
      return json.data;
    },
  });
}
