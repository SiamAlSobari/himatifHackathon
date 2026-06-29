export interface ConsultationHistoryListItem {
  id: string;
  scheduledAt: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "SCHEDULED" | "COMPLETED" | "CANCELLED" | "EXPIRED";
  otherPartyName: string;
  otherPartyImage?: string | null;
  otherPartyRole?: string;
  otherPartyEmail?: string;
  ipfsCid?: string | null;
  txHash?: string | null;
}

export interface ConsultationHistoryMessage {
  id: string;
  sender: "psychologist" | "user";
  text: string;
  createdAt: string;
  time: string; // Formatted time string, e.g. "14:32"
}
