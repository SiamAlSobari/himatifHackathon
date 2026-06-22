import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arahkan Bantuan",
  description: "Dapatkan arahan cepat mengenai hotline krisis darurat, nomor kontak bantuan kesehatan mental, dan rujukan cepat ke psikolog terdekat.",
};

export default function ArahkanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
