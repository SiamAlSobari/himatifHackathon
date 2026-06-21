"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useConsultationHistoryList, useConsultationHistoryMessages } from "@/hooks/konsultasi/useConsultationHistory";
import HistorySidebar from "@/components/riwayatkonsultasi/HistorySidebar";
import ChatArea from "@/components/riwayatkonsultasi/ChatArea";

export default function RiwayatKonsultasiPage() {
  const session = useSession();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileShowSidebar, setMobileShowSidebar] = useState(true);

  // Fetch list of completed/cancelled consultations
  const { data: historyItems = [], isLoading: isListLoading } = useConsultationHistoryList();

  // Fetch messages of the selected consultation
  const { data: messages = [], isLoading: isMessagesLoading } = useConsultationHistoryMessages(selectedId);

  // Redirect if unauthenticated
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-semibold text-slate-500">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  if (!session.data?.user) {
    return null;
  }

  const userRole = ((session.data.user as any).role || "USER") as "USER" | "PSYCHOLOGY";
  const selectedAppointment = historyItems.find((item) => item.id === selectedId) || null;

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setMobileShowSidebar(false);
  };

  return (
    <main className="h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      <div className="flex h-full w-full">
        {/* Left Sidebar Pane */}
        <div
          className={`h-full w-full md:w-80 lg:w-96 shrink-0 ${
            selectedId && !mobileShowSidebar ? "hidden md:block" : "block"
          }`}
        >
          <HistorySidebar
            items={historyItems}
            selectedId={selectedId}
            onSelect={handleSelectItem}
            isLoading={isListLoading}
          />
        </div>

        {/* Right Chat Detail Pane */}
        <div
          className={`h-full flex-1 min-w-0 ${
            !selectedId || mobileShowSidebar ? "hidden md:block" : "block"
          }`}
        >
          <ChatArea
            appointment={selectedAppointment}
            messages={messages}
            isLoading={isMessagesLoading}
            userRole={userRole}
            onBack={() => setMobileShowSidebar(true)}
          />
        </div>
      </div>
    </main>
  );
}