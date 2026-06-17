import { useMutation } from "@tanstack/react-query";

export function useEndSession() {
  const requestEnd = useMutation({
    mutationFn: async ({ appointmentId, requester }: { appointmentId: string; requester: "user" | "psychologist" }) => {
      const res = await fetch("/api/konsultasi/end/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, requester }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal mengajukan akhir sesi");
      }
      return await res.json();
    },
  });

  const confirmEnd = useMutation({
    mutationFn: async ({ appointmentId }: { appointmentId: string }) => {
      const res = await fetch("/api/konsultasi/end/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyetujui akhir sesi");
      }
      return await res.json();
    },
  });

  const declineEnd = useMutation({
    mutationFn: async ({ appointmentId }: { appointmentId: string }) => {
      const res = await fetch("/api/konsultasi/end/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menolak akhir sesi");
      }
      return await res.json();
    },
  });

  return {
    requestEnd: requestEnd.mutateAsync,
    isRequesting: requestEnd.isPending,
    confirmEnd: confirmEnd.mutateAsync,
    isConfirming: confirmEnd.isPending,
    declineEnd: declineEnd.mutateAsync,
    isDeclining: declineEnd.isPending,
  };
}
