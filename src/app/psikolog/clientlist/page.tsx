import ClientListHeader from "@/components/clientlist/Clientlistheader";
import ClientListGrid from "@/components/clientlist/Clientlistgrid";
import { clientListData } from "@/components/clientlist/Clientlistdata";

export default function ListClientPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <ClientListHeader
        title="List Client"
        description="Kelola seluruh data client dengan lebih cepat, rapi, dan efisien."
      />

      <ClientListGrid clients={clientListData} />
    </main>
  );
}
