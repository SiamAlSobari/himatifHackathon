import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to fetch profile data");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to fetch profile data");
      return json.data;
    },
  });
}
