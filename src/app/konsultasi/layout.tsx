import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konsultasi Psikolog",
  description: "Temukan psikolog profesional berlisensi berdasarkan spesialisasi Anda dan buat janji temu konsultasi psikologis secara online.",
};

export default function KonsultasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
