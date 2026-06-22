"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ChatArea from "@/components/konsultasi/ChatArea";
import ContextSidebar from "@/components/konsultasi/ContextSidebar";
import { completeAppointment, cancelAppointment } from "@/app/actions/psychologist";
import { useConsultationChat } from "@/hooks/konsultasi/useConsultationChat";
import { ActiveAppointment, Psychologist } from "@/lib/types/konsultasi";
import { getPusherClient } from "@/lib/pusher/pusher-client";
import { useEndSession } from "@/hooks/konsultasi/useEndSession";
import ConfirmEndSessionModal from "@/components/konsultasi/ConfirmEndSessionModal";

interface KonsultasiClientProps {
  activeAppointment: ActiveAppointment | null;
  userProfile: { id: string; name: string; image?: string };
  latestScreening: {
    score: number;
    createdAt: string;
    type: string;
  } | null;
}

export default function KonsultasiClient({
  activeAppointment,
  userProfile,
  latestScreening,
}: KonsultasiClientProps) {
  const router = useRouter();

  // End session states & hook
  const { requestEnd, confirmEnd, declineEnd, isConfirming, isDeclining } = useEndSession();
  const [endSessionModalOpen, setEndSessionModalOpen] = useState(false);
  const [isIncomingRequest, setIsIncomingRequest] = useState(false);
  const [waitingForResponseModalOpen, setWaitingForResponseModalOpen] = useState(false);

  // 1. Determine active psychologist (from appointment or fallback to mockup)
  const isDemo = !activeAppointment;
  const psychologist: Psychologist = activeAppointment?.psychologist || {
    id: "demo-sarah",
    name: "Dr. Sarah Anindita, M.Psi., Psikolog",
    role: "Psikologi Klinis Dewasa",
    specialty: "Penanganan Stres & Gangguan Kecemasan",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm0bcB0lzDcZlnjBA25NjhIN4_C42QMvYjxW33jb2jch1A0EQCRcaSsOQUnjy3rMikDcIowjhdMI910iiO8Mkanuvq4kRKzOGEYhvhpRZWqgMKTvJofZGbb1HCI4eoTv1Vn1qqKHhHo7gkufVpq6AlJorSOFs6fEUSvTqlYiY6ylLJ6PTn8i_qY38_KETmZ0HhV_7RTHSyI3bS_qCgyVjEfrcP-GyBylZacT3cErIG9i_P9NGyFCM6FCtBJVVioI0F3eKMqvM8HA",
    experienceYears: 8,
    tags: ["Insomnia", "Overthinking", "Palpitasi"],
    strNumber: "STR: 12.34.5.6.78.91011",
    practiceLocation: "RS Medika Utama"
  };

  // 2. Chat history state synced via custom hook
  const {
    messages,
    isOnline,
    isTyping,
    inputValue,
    setInputValue,
    sendMessage,
  } = useConsultationChat(activeAppointment?.id, "user");

  // Real-time synchronization for cancellation redirection
  useEffect(() => {
    if (!activeAppointment || !userProfile?.id) return;

    const pusher = getPusherClient();
    const channelName = `user-${userProfile.id}`;
    const channel = pusher.subscribe(channelName);

    const handleAppointmentUpdate = (data: any) => {
      if (!data.activeAppointment || data.activeAppointment.id !== activeAppointment.id) {
        toast.error("Sesi konsultasi Anda telah dibatalkan.");
        router.push("/arahkan");
      }
    };

    channel.bind("appointment-updated", handleAppointmentUpdate);

    return () => {
      channel.unbind("appointment-updated", handleAppointmentUpdate);
      pusher.unsubscribe(channelName);
    };
  }, [activeAppointment, userProfile?.id, router]);

  // Subscribe to end session Pusher events on channel `appointment-${activeAppointment.id}`
  useEffect(() => {
    if (!activeAppointment?.id) return;

    const pusher = getPusherClient();
    const channelName = `appointment-${activeAppointment.id}`;
    const channel = pusher.subscribe(channelName);

    const handleEndSessionRequested = (data: any) => {
      // If we are NOT the requester, show confirmation modal
      if (data.requester !== "user") {
        setIsIncomingRequest(true);
        setEndSessionModalOpen(true);
      }
    };

    const handleEndSessionDeclined = () => {
      // Initiator gets notified and waiting modal is dismissed
      setWaitingForResponseModalOpen(false);
      toast.error("Permintaan mengakhiri sesi ditolak oleh psikolog.");
    };

    const handleSessionEnded = () => {
      toast.success("Sesi konsultasi telah berakhir.");
      router.push("/arahkan");
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
      if (lastMsg.sender === "psychologist" && lastMsg.id !== lastMessageRef.current) {
        lastMessageRef.current = lastMsg.id;
        // Avoid toast on initial load of historical messages
        if (messages.length > 5) {
          toast.info(`Pesan baru dari ${psychologist.name.split(",")[0]}`);
        }
      }
    }
  }, [messages, psychologist.name]);

  // 3. Countdown timer state based on appointment scheduledAt
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

  // 4. Picture-in-Picture floating view state
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
      router.push("/arahkan");
      return;
    }
    try {
      if (isIncomingRequest) {
        // We are accepting the incoming request
        await confirmEnd({ appointmentId: activeAppointment.id });
        setEndSessionModalOpen(false);
      } else {
        // We are initiating the end session request
        await requestEnd({ appointmentId: activeAppointment.id, requester: "user" });
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
                Sesi Chat Diminimalkan
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
                Anda meminimalkan sesi obrolan ini ke mode Picture-in-Picture (PiP). Gunakan tombol di sudut kanan bawah untuk mengembalikan tampilan penuh.
              </p>
              <button
                onClick={() => setShowPiP(false)}
                className="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Tampilkan Sesi Chat
              </button>
            </div>
          ) : (
            <ChatArea
              psychologistName={psychologist.name}
              psychologistRole={psychologist.role}
              psychologistImage={psychologist.imageUrl}
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
        <ContextSidebar
          durationString={formatTime(secondsLeft)}
          onEndSession={handleEndSession}
          psychologist={psychologist}
          latestScreeningScore={latestScreening?.score || null}
          complaints={psychologist.tags}
        />
      </main>

      {/* Footer is rendered by parent LayoutWrapper */}

      {/* Floating Picture-in-Picture (PiP) View */}
      {showPiP && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-primary p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold uppercase tracking-wider">Sesi Aktif</span>
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
              alt={psychologist.name}
              src={psychologist.imageUrl}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold leading-tight truncate">{psychologist.name}</p>
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
            ? "Psikolog ingin mengakhiri sesi, apakah anda menyetujuinya?"
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
        message="Permintaan mengakhiri sesi telah dikirim. Menunggu konfirmasi dari psikolog..."
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
