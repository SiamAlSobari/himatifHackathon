import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch dashboard data");
      return json.data;
    },
  });
}
