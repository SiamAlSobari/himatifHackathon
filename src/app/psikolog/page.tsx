"use client";

import { useEffect } from "react";
import EmergencyBanner from "@/components/dashboard/Emergencybanner";

import GreetingHeader from "@/components/dashboardpsikolog/Greetingheader";
import TodayConsultationList from "@/components/dashboardpsikolog/Todayconsultationlist";
import ConsultationHistoryTable from "@/components/dashboardpsikolog/Consultationhistorytable";
import ClientListSection from "@/components/dashboardpsikolog/Clientlistsection";
import { usePsychologistDashboard } from "@/hooks/psychologist/usePsychologistDashboard";
import { getPusherClient } from "@/lib/pusher/pusher-client";

export default function DashboardPsikologPage() {
  const { data, isLoading, error, refetch } = usePsychologistDashboard();

  useEffect(() => {
    if (!data?.psychologist?.id) return;

    const pusher = getPusherClient();
    const channelName = `user-${data.psychologist.id}`;
    const channel = pusher.subscribe(channelName);

    const handleBookingUpdate = () => {
      refetch();
    };

    channel.bind("booking-requested", handleBookingUpdate);
    channel.bind("booking-updated", handleBookingUpdate);

    return () => {
      channel.unbind("booking-requested", handleBookingUpdate);
      channel.unbind("booking-updated", handleBookingUpdate);
      pusher.unsubscribe(channelName);
    };
  }, [data?.psychologist?.id, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#004349] border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <h2 className="text-xl font-semibold text-rose-600">Error</h2>
        <p className="text-slate-500 mt-2">
          {error instanceof Error ? error.message : "Gagal mengambil data dashboard psikolog."}
        </p>
      </div>
    );
  }

  const displayName = data.psychologist.name;
  const userImage = data.psychologist.image || undefined;
  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 animate-fade-in duration-500">
        <div className="animate-fade-up duration-500">
          <GreetingHeader name={displayName} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="animate-fade-up delay-100 duration-700 min-h-[100px]">
            <TodayConsultationList consultations={data.todayConsultations} />
          </div>
          <div className="animate-fade-up delay-200 duration-700 min-h-[100px]">
            <ConsultationHistoryTable history={data.consultationHistory} />
          </div>
        </div>

        <div className="animate-fade-up delay-300 duration-700">
          <ClientListSection clients={data.clientList} />
        </div>
      </main>
    </div>
  );
}