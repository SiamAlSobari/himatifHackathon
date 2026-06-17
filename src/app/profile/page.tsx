"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/profile/Profilecard";
import QuickHelpCard from "@/components/profile/Quickhelpcard";
import PersonalInfoCard from "@/components/profile/Personainfocard";
import AccountSettingsCard from "@/components/profile/Accountsettingcard";
import ConsultationHistoryCard from "@/components/profile/Consultationhistorycard";
import MedicalDocumentsCard from "@/components/profile/Medicaldocumentcard";
import { useProfile } from "@/hooks/profile/useProfile";
import {
  consultationHistory,
  footerLinkGroups,
  medicalDocuments,
  quickHelpLinks,
} from "./data";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isLoading } = useProfile();

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

  const displayName = data.dbUser.name || "Pengguna";
  const email = data.dbUser.email || "-";
  const age = data.dbUser.usia || null;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <ProfileCard
              name={displayName}
              age={age}
              location={null}
              avatarUrl={data.dbUser.image}
            />
            <QuickHelpCard title="Butuh Bantuan?" links={quickHelpLinks} />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <PersonalInfoCard
                fullName={displayName}
                email={email}
                phoneNumber={null}
              />
              <AccountSettingsCard initialNotificationsEnabled={false} />
            </div>
          </div>
        </div>

        <ConsultationHistoryCard
          title="Riwayat Konsultasi"
          viewAllLabel="Lihat Semua"
          items={consultationHistory}
        />

        <MedicalDocumentsCard
          title="Dokumen Medis"
          documents={medicalDocuments}
        />
      </main>
  );
}