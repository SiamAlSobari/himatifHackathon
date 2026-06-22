import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Konsultasi",
  description: "Lihat riwayat sesi konsultasi Anda, catatan psikolog, lencana audit blockchain, dan verifikasi integritas data on-chain.",
};

export default function RiwayatKonsultasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
