import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SendMessageVariables {
  sessionId: string;
  message: string;
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, message }: SendMessageVariables) => {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
credentials: "include",
        body: JSON.stringify({ sessionId, message }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to send message");
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-session"] });
    },
  });
}
