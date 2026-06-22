import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Metadata } from "next";
import PsychologistProfileClient from "./profile-client";

export const metadata: Metadata = {
  title: "Profil Mitra Psikolog — MindCare",
  description: "Kelola profil, lihat tren sesi, dan perbarui informasi akun psikolog Anda.",
};

export default async function PsychologistProfilePage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || role !== "PSYCHOLOGY") redirect("/psikolog/login");

  return <PsychologistProfileClient />;
}
