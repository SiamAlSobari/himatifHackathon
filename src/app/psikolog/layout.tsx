import { auth } from "@/auth";
import type { Metadata } from "next";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard Mitra Psikolog",
  description: "Kelola jadwal konsultasi, terima janji temu klien, dan akses berkas riwayat emosional (Medical Brief) pasien Anda secara privat.",
};

export default async function PsychologistLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard")
  }

  if ((session?.user as any).role !== "PSYCHOLOGY") {
    redirect("/")
  }

  return <>{children}</>;
}
