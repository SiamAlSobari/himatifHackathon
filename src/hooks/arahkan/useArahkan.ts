import { useQuery } from "@tanstack/react-query";

export function useArahkan() {
  return useQuery({
    queryKey: ["arahkan-data"],
    queryFn: async () => {
      const res = await fetch("/api/arahkan");
      if (!res.ok) throw new Error("Failed to fetch arahkan data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch arahkan data");
      return json.data;
    },
  });
}
