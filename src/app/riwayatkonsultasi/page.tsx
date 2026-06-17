import RiwayatKonsultasiHeader from "@/components/riwayatkonsultasi/Riwayatkonsultasiheader";
import RiwayatKonsultasiCard from "@/components/riwayatkonsultasi/Riwayatkonsultasicard";
import { riwayatKonsultasiData } from "./data";

export default function RiwayatKonsultasiPage() {
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <RiwayatKonsultasiHeader
        title="Riwayat Konsultasi"
        description="Lihat seluruh riwayat konsultasi yang telah dijalani"
      />

      <RiwayatKonsultasiCard history={riwayatKonsultasiData} />
    </main>
  );
}