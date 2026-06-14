import { auth } from "@/auth";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/footer";
import ProfileCard from "@/components/profile/Profilecard";
import QuickHelpCard from "@/components/profile/Quickhelpcard";
import PersonalInfoCard from "@/components/profile/Personainfocard";
import AccountSettingsCard from "@/components/profile/Accountsettingcard";
import ConsultationHistoryCard from "@/components/profile/Consultationhistorycard";
import MedicalDocumentsCard from "@/components/profile/Medicaldocumentcard";
import {
  consultationHistory,
  footerLinkGroups,
  medicalDocuments,
  quickHelpLinks,
} from "./data";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  const displayName = user?.name || user?.email || "Pengguna";
  const email = user?.email || "-";

  // Field tambahan seperti usia, lokasi, dan nomor telepon belum ada di
  // session default NextAuth. Jika sudah ditambahkan ke model User & callback
  // session, ganti null di bawah ini dengan misal: (user as any).usia, dst.
  const age = null as number | null;
  const location = null as string | null;
  const phoneNumber = null as string | null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={displayName} userImage={user?.image} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <ProfileCard
              name={displayName}
              age={age}
              location={location}
              avatarUrl={user?.image}
            />
            <QuickHelpCard title="Butuh Bantuan?" links={quickHelpLinks} />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <PersonalInfoCard
                fullName={displayName}
                email={email}
                phoneNumber={phoneNumber}
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

      <Footer linkGroups={footerLinkGroups} />
    </div>
  );
}