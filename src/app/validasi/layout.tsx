import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Validasi AI",
  description: "Curhat 24/7 secara anonim dan aman dengan Very AI, chatbot empatik kami yang didukung Google Gemini untuk validasi emosi awal tanpa diagnosa medis.",
};

export default function ValidasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
