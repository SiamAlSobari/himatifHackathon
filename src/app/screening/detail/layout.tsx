import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Screening",
  description: "Isi kuesioner screening kesehatan mental harian atau onboarding untuk memetakan emosi Anda secara terperinci.",
};

export default function ScreeningDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
