import { useQuery } from "@tanstack/react-query";

export function useKonsultasi(appointmentId?: string) {
  return useQuery({
    queryKey: ["konsultasi-data", appointmentId],
    queryFn: async () => {
      const url = appointmentId ? `/api/konsultasi?appointmentId=${appointmentId}` : "/api/konsultasi";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch konsultasi data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch konsultasi data");
      return json.data;
    },
  });
}
