"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/footer";
import PsychologistChatArea from "@/components/konsultasi/PsychologistChatArea";
import PsychologistSidebar from "@/components/konsultasi/PsychologistSidebar";
import { completeAppointment } from "@/app/actions/psychologist";
import { footerLinkGroups } from "@/app/dashboard/data";

// Pre-programmed user/client replies for interactive feel from psychologist POV
const MOCK_USER_REPLIES = [
  "Iya Dokter, saya sangat bersedia. Tolong bimbing saya untuk melakukan pernapasan itu.",
  "Setelah melakukannya 3 kali, dada saya terasa sedikit lebih lega, tapi pikiran cemasnya masih membayangi.",
  "Ketakutan terbesar saya adalah mengecewakan atasan dan dianggap tidak kompeten, yang bisa berujung pada pemecatan.",
  "Terima kasih, Dokter. Penjelasan itu masuk akal bagi saya. Saya siap melanjutkan sesinya."
];

interface ClientProfile {
  name: string;
  image?: string;
  email: string;
  usia?: number | null;
  jenisKelamin?: string | null;
}

interface Psychologist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  imageUrl: string;
  experienceYears: number;
  tags: string[];
}

interface ActiveAppointment {
  id: string;
  scheduledAt: string;
  psychologist: Psychologist;
}

interface PsychologistKonsultasiClientProps {
  activeAppointment: ActiveAppointment | null;
  client: ClientProfile;
  latestScreeningScore: number | null;
  finalConclusion: string | null;
}

export default function PsychologistKonsultasiClient({
  activeAppointment,
  client,
  latestScreeningScore,
  finalConclusion,
}: PsychologistKonsultasiClientProps) {
  const router = useRouter();

  // 1. Initial messages (identical history as User POV but aligned for Psychologist counterpart)
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "psychologist" as const,
      text: "Halo. Saya Dr. Sarah. Saya sudah meninjau hasil skrining 'Kenali' Anda. Terima kasih sudah bersedia berbagi. Bagaimana perasaan Anda saat ini?",
      time: "10:02 AM",
    },
    {
      id: "2",
      sender: "user" as const,
      text: "Halo Dokter. Sejujurnya saya merasa sangat cemas beberapa hari terakhir ini. Sulit sekali untuk fokus di pekerjaan.",
      time: "10:05 AM",
    },
    {
      id: "3",
      sender: "psychologist" as const,
      text: "Saya mengerti, rasa cemas memang bisa sangat menguras energi. Di laporan Anda tertulis ada gangguan tidur juga, apakah itu masih berlanjut sampai tadi malam?",
      time: "10:06 AM",
    },
    {
      id: "4",
      sender: "user" as const,
      text: "Iya Dokter, saya hanya tidur sekitar 3-4 jam. Pikiran saya tidak bisa berhenti berputar tentang kesalahan-kesalahan kecil di kantor.",
      time: "10:08 AM",
    },
    {
      id: "5",
      sender: "psychologist" as const,
      text: "Pikiran yang berulang (rumination) memang seringkali mengganggu waktu istirahat. Mari kita coba teknik pernapasan sejenak sebelum kita bahas lebih lanjut, apakah Anda bersedia?",
      time: "10:10 AM",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);

  // 2. Countdown timer state (starts at 24 minutes 12 seconds to match mockup exactly)
  const [secondsLeft, setSecondsLeft] = useState(1452);
  const [isFinished, setIsFinished] = useState(false);

  // 3. Picture-in-Picture floating view state
  const [showPiP, setShowPiP] = useState(false);

  // Timer Tick Down Effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsFinished(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle message send
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    // Add psychologist message
    const now = new Date();
    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const psychMsg = {
      id: Math.random().toString(),
      sender: "psychologist" as const,
      text,
      time: timeString,
    };

    setMessages((prev) => [...prev, psychMsg]);
    setInputValue("");

    // Simulate user/client typing response
    setIsTyping(true);

    setTimeout(() => {
      const replyText = MOCK_USER_REPLIES[replyIndex] || MOCK_USER_REPLIES[MOCK_USER_REPLIES.length - 1];
      setReplyIndex((prev) => Math.min(MOCK_USER_REPLIES.length - 1, prev + 1));

      const userMsg = {
        id: Math.random().toString(),
        sender: "user" as const,
        text: replyText,
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(false);
      
      toast.info(`Pesan baru dari Klien: ${client.name.split(" ")[0]}`);
    }, 3000);
  };

  // Handle end session
  const handleEndSession = async () => {
    const confirmClose = window.confirm(
      "Apakah Anda yakin ingin mengakhiri sesi konsultasi aktif ini? Catatan klinis klien akan diperbarui."
    );
    if (!confirmClose) return;

    try {
      if (activeAppointment) {
        await completeAppointment(activeAppointment.id);
        toast.success("Sesi konsultasi berhasil diselesaikan oleh Anda.");
      } else {
        toast.success("Sesi demo diselesaikan.");
      }
      router.push("/arahkan");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengakhiri sesi.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md antialiased flex flex-col justify-between">
      {/* Navbar wrapper */}
      <Navbar userName="Psikolog" userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCm0bcB0lzDcZlnjBA25NjhIN4_C42QMvYjxW33jb2jch1A0EQCRcaSsOQUnjy3rMikDcIowjhdMI910iiO8Mkanuvq4kRKzOGEYhvhpRZWqgMKTvJofZGbb1HCI4eoTv1Vn1qqKHhHo7gkufVpq6AlJorSOFs6fEUSvTqlYiY6ylLJ6PTn8i_qY38_KETmZ0HhV_7RTHSyI3bS_qCgyVjEfrcP-GyBylZacT3cErIG9i_P9NGyFCM6FCtBJVVioI0F3eKMqvM8HA" isOnboarded={true} />

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
              isTyping={isTyping}
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSend={handleSend}
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

      {/* Footer */}
      <Footer linkGroups={footerLinkGroups} />

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
    </div>
  );
}
