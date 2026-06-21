export interface ConsultationHistoryListItem {
  id: string;
  scheduledAt: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  otherPartyName: string;
  otherPartyImage?: string | null;
  otherPartyRole?: string;
  otherPartyEmail?: string;
}

export interface ConsultationHistoryMessage {
  id: string;
  sender: "psychologist" | "user";
  text: string;
  createdAt: string;
  time: string; // Formatted time string, e.g. "14:32"
}
