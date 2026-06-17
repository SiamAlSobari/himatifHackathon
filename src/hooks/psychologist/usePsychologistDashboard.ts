import { useQuery } from "@tanstack/react-query";
import { TodayConsultation, ConsultationHistoryItem, ClientItem } from "@/lib/types/dashboardpsikolog";

export interface PsychologistDashboardData {
  psychologist: {
    name: string;
    image: string;
  };
  todayConsultations: TodayConsultation[];
  consultationHistory: ConsultationHistoryItem[];
  clientList: ClientItem[];
}

export function usePsychologistDashboard() {
  return useQuery<PsychologistDashboardData>({
    queryKey: ["psychologist-dashboard-data"],
    queryFn: async () => {
      const res = await fetch("/api/psikolog/dashboard");
      if (!res.ok) throw new Error("Failed to fetch psychologist dashboard data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch psychologist dashboard data");
      return json.data;
    },
  });
}
