"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ActivityCard from "@/components/dashboard/Activitycard";
import DashboardHeader from "@/components/dashboard/Dashboardheader";
import EmergencyBanner from "@/components/dashboard/Emergencybanner";
import MoodChartCard from "@/components/dashboard/Moodchartcard";
import ScheduleCard from "@/components/dashboard/Schedulecard";
import ScreeningSummaryCard from "@/components/dashboard/Screeningsummarycard";
import { useDashboard } from "@/hooks/dashboard/useDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading } = useDashboard();

  const [selectedResults, setSelectedResults] = useState<any[] | null>(null);
  const [selectedDayLabel, setSelectedDayLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.user.usia || !data.user.jenisKelamin) {
        router.push("/onboarding");
      } else if (!data.hasScreenedToday) {
        router.push("/screening");
      }
    }
  }, [data, isLoading, router]);

  // Sync initial selections with fetched data
  useEffect(() => {
    if (data) {
      // Find today's day data point
      const todayPt = data.moodData.find((pt: any) => pt.isToday);
      
      // If today has data, use its results. Otherwise, use latest screeningResults or null
      if (todayPt && todayPt.hasData) {
        setSelectedResults(todayPt.screeningResults);
        setSelectedDayLabel(todayPt.day);
      } else {
        setSelectedResults(data.screeningResults);
        setSelectedDayLabel(todayPt ? todayPt.day : "Hari Ini");
      }
    }
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#004349] border-t-transparent" />
      </div>
    );
  }

  const displayName = data.user.name || "Pengguna";
  const firstName = displayName.split(" ")[0];

  const handleBarClick = (day: string, value: number, screeningResults: any[] | null) => {
    setSelectedDayLabel(day);
    setSelectedResults(screeningResults);
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
      <DashboardHeader name={firstName} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MoodChartCard
            title="Jejak Kesejahteraan"
            rangeLabel="7 Hari Terakhir"
            data={data.moodData}
            selectedDay={selectedDayLabel}
            onBarClick={handleBarClick}
          />
        </div>
        <ScreeningSummaryCard
          title="Ringkasan Kenali"
          results={selectedResults}
          dayLabel={selectedDayLabel}
          ctaLabel="Lihat Detail Screening"
          onCtaClick={() => router.push("/screening/detail")}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScheduleCard
          title="Jadwal Mendatang"
          viewAllLabel="Lihat Semua"
          items={data.scheduleItems}
        />
        <ActivityCard
          title="Rekomendasi Aktivitas"
          subtitle="Berdasarkan skor stresmu hari ini."
          description=""
          items={data.activityRecommendations}
        />
      </div>

      <EmergencyBanner
        title="Butuh bantuan segera?"
        description="Tim kami tersedia 24/7 untuk situasi darurat psikologis."
        ctaLabel="Panggil Bantuan"
        phoneNumber="119"
      />
    </main>
  );
}