import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Klien",
  description: "Daftar riwayat klien yang telah berkonsultasi dengan Anda beserta grafik emosi harian mereka.",
};

export default function ClientListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
