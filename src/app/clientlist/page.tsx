import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/Navbar";
import { footerLinkGroups } from "@/app/dashboard/data";

import ClientListHeader from "@/components/clientlist/Clientlistheader";
import ClientListGrid from "@/components/clientlist/Clientlistgrid";
import { clientListData } from "@/components/clientlist/Clientlistdata";

export default function ListClientPage() {
  const displayName = "Dr Kontol";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={displayName} userImage={undefined} />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <ClientListHeader
          title="List Client"
          description="Kelola seluruh data client dengan lebih cepat, rapi, dan efisien."
        />

        <ClientListGrid clients={clientListData} />
      </main>

      <Footer linkGroups={footerLinkGroups} />
    </div>
  );
}