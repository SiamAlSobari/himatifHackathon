import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RespondBookingVariables {
  appointmentId: string;
  action: "ACCEPT" | "DECLINE";
}

export function useRespondToBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, action }: RespondBookingVariables) => {
      const res = await fetch("/api/psikolog/booking/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId, action }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Gagal ${action === "ACCEPT" ? "menerima" : "menolak"} booking`);
      }
      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["psychologist-dashboard-data"] });
    },
  });
}
