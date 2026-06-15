import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/Navbar";
import EmergencyBanner from "@/components/dashboard/Emergencybanner";
import { footerLinkGroups } from "@/app/dashboard/data";

import GreetingHeader from "@/components/dashboardpsikolog/Greetingheader";
import TodayConsultationList from "@/components/dashboardpsikolog/Todayconsultationlist";
import ConsultationHistoryTable from "@/components/dashboardpsikolog/Consultationhistorytable";
import ClientListSection from "@/components/dashboardpsikolog/Clientlistsection";
import { todayConsultations, consultationHistory, clientList } from "./data";

export default function DashboardPsikologPage() {
  const displayName = "Dr Kontol";
  const apasaja = "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={displayName} userImage={apasaja} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <GreetingHeader name={displayName} />

        <div className="grid gap-6 lg:grid-cols-2">
          <TodayConsultationList consultations={todayConsultations} />
          <ConsultationHistoryTable history={consultationHistory} />
        </div>

        <ClientListSection clients={clientList} />

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