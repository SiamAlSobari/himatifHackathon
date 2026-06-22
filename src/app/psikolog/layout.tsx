import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Mitra Psikolog",
  description: "Kelola jadwal konsultasi, terima janji temu klien, dan akses berkas riwayat emosional (Medical Brief) pasien Anda secara privat.",
};

export default function PsychologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
