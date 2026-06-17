"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ActivityCard from "@/components/dashboard/Activitycard";
import DashboardHeader from "@/components/dashboard/Dashboardheader";
import EmergencyBanner from "@/components/dashboard/Emergencybanner";
import Footer from "@/components/ui/footer";
import MoodChartCard from "@/components/dashboard/Moodchartcard";
import Navbar from "@/components/ui/Navbar";
import ScheduleCard from "@/components/dashboard/Schedulecard";
import ScreeningSummaryCard from "@/components/dashboard/Screeningsummarycard";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import {
  activityRecommendations,
  footerLinkGroups,
  moodData,
  scheduleItems,
  screeningResults,
} from "./data";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useDashboard();

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.user.usia || !data.user.jenisKelamin) {
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

  const displayName = data.user.name || "Pengguna";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={displayName} userImage={data.user.image || undefined} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <DashboardHeader name={firstName} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MoodChartCard
              title="Jejak Kesejahteraan"
              rangeLabel="7 Hari Terakhir"
              data={moodData}
            />
          </div>
          <ScreeningSummaryCard
            title="Ringkasan Kenali"
            results={screeningResults}
            ctaLabel="Lihat Detail Screening"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ScheduleCard
            title="Jadwal Mendatang"
            viewAllLabel="Lihat Semua"
            items={scheduleItems}
          />
          <ActivityCard
            title="Rekomendasi Aktivitas"
            subtitle="Berdasarkan skor stresmu hari ini."
            description=""
            items={activityRecommendations}
          />
        </div>

        <EmergencyBanner
          title="Butuh bantuan segera?"
          description="Tim kami tersedia 24/7 untuk situasi darurat psikologis."
          ctaLabel="Panggil Bantuan"
          phoneNumber="119"
        />
      </main>

      <Footer linkGroups={footerLinkGroups} />
    </div>
  );
}