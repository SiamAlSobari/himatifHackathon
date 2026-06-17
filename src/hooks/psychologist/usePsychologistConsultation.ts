import { useQuery } from "@tanstack/react-query";
import { ActiveAppointment, ClientProfile } from "@/lib/types/konsultasi";

export interface PsychologistConsultationData {
  activeAppointment: ActiveAppointment;
  client: ClientProfile;
  latestScreeningScore: number | null;
  clientTheme: string;
  finalConclusion: string | null;
  psychologistUser: {
    name: string;
    image: string;
  };
}

export function usePsychologistConsultation(appointmentId?: string) {
  return useQuery<PsychologistConsultationData | null>({
    queryKey: ["psychologist-consultation", appointmentId],
    queryFn: async () => {
      const url = appointmentId
        ? `/api/psikolog/konsultasi?appointmentId=${appointmentId}`
        : "/api/psikolog/konsultasi";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch consultation session");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch consultation session");
      return json.data;
    },
  });
}
