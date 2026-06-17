import { useQuery } from "@tanstack/react-query";
import { ClientItem } from "@/lib/types/dashboardpsikolog";

export function usePsychologistClients() {
  return useQuery<ClientItem[]>({
    queryKey: ["psychologist-clients-list"],
    queryFn: async () => {
      const res = await fetch("/api/psikolog/clients");
      if (!res.ok) throw new Error("Failed to fetch psychologist clients list");
      const json = await res.json();
      if (!json.success) {
        throw new Error(
          json.error || "Failed to fetch psychologist clients list"
        );
      }
      return json.data;
    },
  });
}
