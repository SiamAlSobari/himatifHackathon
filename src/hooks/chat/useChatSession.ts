import { useQuery } from "@tanstack/react-query";
import { ChatSessionData } from "@/lib/types/chat";

export function useChatSession() {
  return useQuery<ChatSessionData>({
    queryKey: ["chat-session"],
    queryFn: async () => {
      const res = await fetch("/api/ai/session");
      if (!res.ok) {
        throw new Error("Failed to fetch active session");
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Failed to fetch active session");
      }
      return json.data;
    },
  });
}
