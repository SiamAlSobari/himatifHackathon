import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ActivityCard from "@/components/dashboard/Activitycard";
// import ChatWidget from "@/components/dashboard/Chatwidget";
import DashboardHeader from "@/components/dashboard/Dashboardheader";
import EmergencyBanner from "@/components/dashboard/Emergencybanner";
import Footer from "@/components/ui/footer";
import MoodChartCard from "@/components/dashboard/Moodchartcard";
import Navbar from "@/components/ui/Navbar";
import ScheduleCard from "@/components/dashboard/Schedulecard";
import ScreeningSummaryCard from "@/components/dashboard/Screeningsummarycard";
import {
  activityRecommendations,
  footerLinkGroups,
  moodData,
  scheduleItems,
  screeningResults,
} from "./data";

export default async function DashboardPage() {
  const session = await auth();
  // if (!session?.user?.id) {
  //   redirect("/login?callbackUrl=/dashboard");
  // }

const dbUser = session?.user?.id
  ? await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        image: true,
        email: true,
        usia: true,
        jenisKelamin: true,
        isOnboarded: true,
      },
    })
  : {
      name: "Developer",
      image: null,
      email: "developer@test.com",
      usia: 20,
      jenisKelamin: "L",
      isOnboarded: true,
    };

  // if (!dbUser?.usia || !dbUser?.jenisKelamin) {
  //   redirect("/onboarding");
  // }

  // if (!dbUser?.isOnboarded) {
  //   redirect("/screening");
  // }

  const displayName = dbUser?.name || dbUser?.email || "Pengguna";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={displayName} userImage={dbUser?.image} />

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
      {/* <ChatWidget /> */}
    </div>
  );
}