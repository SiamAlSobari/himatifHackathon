"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PsychologistChatArea from "@/components/konsultasi/PsychologistChatArea";
import PsychologistSidebar from "@/components/konsultasi/PsychologistSidebar";
import { useConsultationChat } from "@/hooks/konsultasi/useConsultationChat";
import { ActiveAppointment, ClientProfile } from "@/lib/types/konsultasi";
import { getPusherClient } from "@/lib/pusher/pusher-client";
import { useEndSession } from "@/hooks/konsultasi/useEndSession";
import ConfirmEndSessionModal from "@/components/konsultasi/ConfirmEndSessionModal";


interface PsychologistKonsultasiClientProps {
  activeAppointment: ActiveAppointment | null;
  client: ClientProfile;
  latestScreeningScore: number | null;
  clientTheme: string;
  finalConclusion: string | null;
  psychologistUser: {
    name: string;
    image: string;
  };
}

export default function PsychologistKonsultasiClient({
  activeAppointment,
  client,
  latestScreeningScore,
  clientTheme,
  finalConclusion,
  psychologistUser,
}: PsychologistKonsultasiClientProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || !clientTheme) return;

    const root = document.documentElement;
    const originalThemes: string[] = [];
    root.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        originalThemes.push(cls);
        root.classList.remove(cls);
      }
    });

    root.classList.add(`theme-${clientTheme}`);

    return () => {
      root.classList.remove(`theme-${clientTheme}`);
      originalThemes.forEach((cls) => {
        root.classList.add(cls);
      });
    };
  }, [clientTheme]);

  // End session states & hook
  const { requestEnd, confirmEnd, declineEnd, isConfirming, isDeclining } = useEndSession();
  const [endSessionModalOpen, setEndSessionModalOpen] = useState(false);
  const [isIncomingRequest, setIsIncomingRequest] = useState(false);
  const [waitingForResponseModalOpen, setWaitingForResponseModalOpen] = useState(false);


  // 1. Chat history state synced via custom hook
  const {
    messages,
    isOnline,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
  } = useConsultationChat(activeAppointment?.id, "psychologist");

  // Real-time synchronization for cancellation redirection
  useEffect(() => {
    if (!activeAppointment || !client?.id) return;

    const pusher = getPusherClient();
    const channelName = `user-${client.id}`;
    const channel = pusher.subscribe(channelName);

    const handleAppointmentUpdate = (data: any) => {
      if (!data.activeAppointment || data.activeAppointment.id !== activeAppointment.id) {
        toast.error("Sesi konsultasi dengan Klien telah dibatalkan.");
        router.push("/psikolog");
      }
    };

    channel.bind("appointment-updated", handleAppointmentUpdate);

    return () => {
      channel.unbind("appointment-updated", handleAppointmentUpdate);
      pusher.unsubscribe(channelName);
    };
  }, [activeAppointment, client?.id, router]);

  // Subscribe to end session Pusher events on channel `appointment-${activeAppointment.id}`
  useEffect(() => {
    if (!activeAppointment?.id) return;

    const pusher = getPusherClient();
    const channelName = `appointment-${activeAppointment.id}`;
    const channel = pusher.subscribe(channelName);

    const handleEndSessionRequested = (data: any) => {
      // If we are NOT the requester, show confirmation modal
      if (data.requester !== "psychologist") {
        setIsIncomingRequest(true);
        setEndSessionModalOpen(true);
      }
    };

    const handleEndSessionDeclined = () => {
      // Initiator gets notified and waiting modal is dismissed
      setWaitingForResponseModalOpen(false);
      toast.error("Permintaan mengakhiri sesi ditolak oleh pasien.");
    };

    const handleSessionEnded = () => {
      toast.success("Sesi konsultasi telah berakhir.");
      router.push("/psikolog");
    };

    channel.bind("end-session", handleEndSessionRequested);
    channel.bind("end-session-declined", handleEndSessionDeclined);
    channel.bind("session-ended", handleSessionEnded);

    return () => {
      channel.unbind("end-session", handleEndSessionRequested);
      channel.unbind("end-session-declined", handleEndSessionDeclined);
      channel.unbind("session-ended", handleSessionEnded);
      pusher.unsubscribe(channelName);
    };
  }, [activeAppointment?.id, router]);

  // Track latest message id to display toast
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "user" && lastMsg.id !== lastMessageRef.current) {
        lastMessageRef.current = lastMsg.id;
        // Avoid toast on initial load of historical messages
        if (messages.length > 5) {
          toast.info(`Pesan baru dari Klien: ${client.name.split(" ")[0]}`);
        }
      }
    }
  }, [messages, client.name]);

  // 2. Countdown timer state based on appointment scheduledAt
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (activeAppointment) {
      const now = Date.now();
      const scheduledTime = new Date(activeAppointment.scheduledAt).getTime();
      if (now < scheduledTime) {
        return 1500; // Sesi belum dimulai, tunjukkan 25 menit
      }
      const endTime = scheduledTime + 25 * 60 * 1000;
      const left = Math.max(0, Math.floor((endTime - now) / 1000));
      return left;
    }
    return 1500;
  });
  const [isFinished, setIsFinished] = useState(false);

  // Check if session has actually started
  const isAppointmentStarted = activeAppointment
    ? Date.now() >= new Date(activeAppointment.scheduledAt).getTime()
    : true;

  // 3. Picture-in-Picture floating view state
  const [showPiP, setShowPiP] = useState(false);

  // Timer Tick Down Effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (!isFinished) {
        setIsFinished(true);
        if (activeAppointment?.id) {
          confirmEnd({ appointmentId: activeAppointment.id })
            .then(() => {
              toast.success("Waktu konsultasi habis! Sesi otomatis diakhiri dan disimpan ke Blockchain.");
            })
            .catch((err) => {
              console.error("Gagal mengakhiri sesi otomatis:", err);
            });
        }
      }
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(() => {
        if (activeAppointment) {
          const now = Date.now();
          const scheduledTime = new Date(activeAppointment.scheduledAt).getTime();
          if (now < scheduledTime) {
            return 1500;
          }
          const endTime = scheduledTime + 25 * 60 * 1000;
          const left = Math.max(0, Math.floor((endTime - now) / 1000));
          if (left <= 0) {
            clearInterval(timer);
          }
          return left;
        } else {
          return Math.max(0, secondsLeft - 1);
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, activeAppointment, isFinished]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle end session
  const handleEndSession = async () => {
    setIsIncomingRequest(false);
    setEndSessionModalOpen(true);
  };

  const handleConfirmEndSession = async () => {
    if (!activeAppointment?.id) {
      // Demo mode completion fallback
      toast.success("Sesi demo diselesaikan.");
      router.push("/psikolog");
      return;
    }
    try {
      if (isIncomingRequest) {
        // We are accepting the incoming request
        await confirmEnd({ appointmentId: activeAppointment.id });
        setEndSessionModalOpen(false);
      } else {
        // We are initiating the end session request
        await requestEnd({ appointmentId: activeAppointment.id, requester: "psychologist" });
        setEndSessionModalOpen(false);
        setWaitingForResponseModalOpen(true);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memproses akhir sesi.");
    }
  };

  const handleDeclineEndSession = async () => {
    if (!activeAppointment?.id) {
      setEndSessionModalOpen(false);
      return;
    }
    try {
      if (isIncomingRequest) {
        await declineEnd({ appointmentId: activeAppointment.id });
      }
      setEndSessionModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak akhir sesi.");
    }
  };

  return (
    <div className="bg-background text-on-surface font-body-md antialiased flex flex-col justify-between">
      <main className="mx-auto max-w-7xl w-full px-6 pt-24 pb-12 flex flex-col md:flex-row gap-gutter flex-1">
        {/* Left Side: Chat Panel */}
        <div className="flex-1">
          {showPiP ? (
            <div className="flex flex-col items-center justify-center h-[750px] bg-white border border-outline-variant rounded-xl soft-bloom p-8 text-center">
              <span className="material-symbols-outlined text-teal-800 text-6xl animate-pulse">
                chat_bubble
              </span>
              <h3 className="font-headline-md text-xl font-bold text-teal-950 mt-4">
                Sesi Chat Klien Diminimalkan
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
                Tampilan chat dengan klien sedang disembunyikan. Klik tombol di sudut kanan bawah untuk membuka kembali.
              </p>
              <button
                onClick={() => setShowPiP(false)}
                className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Tampilkan Sesi Chat
              </button>
            </div>
          ) : (
            <PsychologistChatArea
              clientName={client.name}
              clientImage={client.image || "https://i.pravatar.cc/80?img=12"}
              isOnline={isOnline}
              isTyping={isTyping}
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSend={sendMessage}
              isDisabled={!isAppointmentStarted}
            />
          )}
        </div>

        {/* Right Side: Context Info Sidebar */}
        <PsychologistSidebar
          durationString={formatTime(secondsLeft)}
          onEndSession={handleEndSession}
          client={client}
          latestScreeningScore={latestScreeningScore}
          finalConclusion={finalConclusion}
        />
      </main>



      {/* Floating Picture-in-Picture (PiP) View */}
      {showPiP && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-primary p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold uppercase tracking-wider">Klien Aktif</span>
            </div>
            <button
              onClick={() => setShowPiP(false)}
              className="material-symbols-outlined text-white text-sm hover:text-slate-200 cursor-pointer"
            >
              open_in_full
            </button>
          </div>
          <div className="p-4 flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover border border-slate-100"
              alt={client.name}
              src={client.image || "https://i.pravatar.cc/80?img=12"}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight truncate">{client.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">
                {isTyping ? "Sedang mengetik..." : "Online • " + formatTime(secondsLeft)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Option to minimize chat into PiP (rendered next to sidebar) */}
      {!showPiP && (
        <button
          onClick={() => setShowPiP(true)}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 bg-[#004349] hover:bg-[#0d5c63] text-white p-3.5 rounded-full shadow-lg transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          title="Minimalkan Sesi"
        >
          <span className="material-symbols-outlined text-xl">picture_in_picture_alt</span>
        </button>
      )}

      {/* Confirmation and request modals */}
      <ConfirmEndSessionModal
        isOpen={endSessionModalOpen}
        title={isIncomingRequest ? "Persetujuan Akhiri Sesi" : "Akhiri Sesi Konsultasi"}
        message={
          isIncomingRequest
            ? "Pasien ingin mengakhiri sesi, apakah anda menyetujuinya?"
            : "Apakah Anda yakin ingin mengajukan permohonan untuk mengakhiri sesi konsultasi ini?"
        }
        onConfirm={handleConfirmEndSession}
        onDecline={handleDeclineEndSession}
        isConfirming={isConfirming}
        isDeclining={isDeclining}
        confirmLabel={isIncomingRequest ? "Ya" : "Ya, Ajukan"}
        declineLabel={isIncomingRequest ? "Tidak" : "Batal"}
      />

      <ConfirmEndSessionModal
        isOpen={waitingForResponseModalOpen}
        title="Menunggu Persetujuan"
        message="Permintaan mengakhiri sesi telah dikirim. Menunggu konfirmasi dari pasien..."
        onConfirm={() => {}}
        onDecline={() => {
          setWaitingForResponseModalOpen(false);
        }}
        declineLabel="Tutup"
        confirmLabel="Menunggu..."
        isConfirming={true}
      />
    </div>
  );
}
