"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import PsychologistKonsultasiClient from "./konsultasi-client";
import { usePsychologistConsultation } from "@/hooks/psychologist/usePsychologistConsultation";

export default function PsychologistKonsultasiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId") || undefined;

  const { data, isLoading, error } = usePsychologistConsultation(appointmentId);

  useEffect(() => {
    if (error) {
      console.error("Failed to load consultation session:", error);
      router.push("/login");
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#004349] border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-md">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-slate-400">chat_bubble</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Tidak Ada Sesi Aktif</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Tidak ditemukan sesi konsultasi yang sedang aktif atau terjadwal untuk Anda saat ini. Silakan kembali ke dashboard utama.
          </p>
          <a
            href="/psikolog"
            className="px-6 py-2.5 bg-[#0D1B2A] hover:bg-[#1A8A7A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-block"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <PsychologistKonsultasiClient
      activeAppointment={data.activeAppointment}
      client={data.client}
      latestScreeningScore={data.latestScreeningScore}
      finalConclusion={data.finalConclusion}
      psychologistUser={data.psychologistUser}
    />
  );
}
