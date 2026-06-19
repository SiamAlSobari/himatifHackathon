"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KonsultasiClient from "./konsultasi-client";
import { useKonsultasi } from "@/hooks/konsultasi/useKonsultasi";

function KonsultasiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId") || undefined;
  const { data, isLoading } = useKonsultasi(appointmentId);

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.dbUser.usia || !data.dbUser.jenisKelamin) {
        router.push("/onboarding");
      } else if (!data.hasScreenedToday) {
        router.push("/screening");
      }
    }
  }, [data, isLoading, router]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#004349] border-t-transparent" />
      </div>
    );
  }

  return (
    <KonsultasiClient
      activeAppointment={data.activeAppointment}
      userProfile={data.dbUser}
      latestScreening={data.latestScreening}
    />
  );
}

export default function KonsultasiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#004349] border-t-transparent" />
      </div>
    }>
      <KonsultasiContent />
    </Suspense>
  );
}
