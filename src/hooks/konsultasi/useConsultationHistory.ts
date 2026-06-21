import { useQuery } from "@tanstack/react-query";
import { ConsultationHistoryListItem, ConsultationHistoryMessage } from "@/lib/types/consultation-history";

export function useConsultationHistoryList() {
  return useQuery<ConsultationHistoryListItem[]>({
    queryKey: ["consultation-history-list"],
    queryFn: async () => {
      const res = await fetch("/api/konsultasi/history");
      if (!res.ok) throw new Error("Gagal mengambil riwayat konsultasi");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal mengambil riwayat konsultasi");
      return json.data;
    },
  });
}

export function useConsultationHistoryMessages(appointmentId: string | null) {
  return useQuery<ConsultationHistoryMessage[]>({
    queryKey: ["consultation-history-messages", appointmentId],
    queryFn: async () => {
      if (!appointmentId) return [];
      const res = await fetch(`/api/konsultasi/history/messages?appointmentId=${appointmentId}`);
      if (!res.ok) throw new Error("Gagal mengambil pesan riwayat");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal mengambil pesan riwayat");
      return json.data;
    },
    enabled: !!appointmentId,
  });
}
