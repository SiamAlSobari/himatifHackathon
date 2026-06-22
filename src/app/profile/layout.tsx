import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola informasi akun Anda, kontak darurat, preferensi platform, dan status onboarding kesehatan mental.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
