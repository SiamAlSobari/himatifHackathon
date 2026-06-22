import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Konsultasi Klien",
  description: "Sesi konsultasi psikologi real-time terenkripsi dengan klien, dilengkapi dengan integrasi rekam medis on-chain.",
};

export default function PsychologistKonsultasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
