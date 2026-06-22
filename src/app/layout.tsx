import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "@/components/providers/Providers";
import LayoutWrapper from "@/components/ui/LayoutWrapper";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://verimind.web.id"),
  title: {
    template: "%s — Verimind",
    default: "Verimind — Platform Pertolongan Pertama Psikologis & Konsultasi Mental",
  },
  description: "Verimind adalah platform Psychological First Aid (PFA) inovatif berbasis AI empatik (Google Gemini) dan integritas on-chain blockchain Polygon untuk memvalidasi emosi, melakukan screening kesehatan mental, dan menghubungkan Anda dengan psikolog profesional secara aman dan privat.",
  keywords: ["kesehatan mental", "psychological first aid", "PFA", "AI psikologi", "curhat AI", "konseling online", "psikolog profesional", "blockchain", "Polygon", "rekam medis aman", "screening mental", "Verimind", "deteksi krisis"],
  authors: [{ name: "Verimind Team" }],
  icons: {
    icon: "/logo-app.png",
    shortcut: "/logo-app.png",
    apple: "/logo-app.png",
  },
  openGraph: {
    title: "Verimind — Platform Pertolongan Pertama Psikologis & Konsultasi Mental",
    description: "Beri ruang aman bagi pikiran Anda. Hubungi chatbot AI empatik kami untuk validasi emosi awal, screening kesehatan mental harian, atau hubungkan dengan psikolog berlisensi secara aman dengan integritas on-chain.",
    type: "website",
    url: "https://verimind.id",
    siteName: "Verimind",
    images: [
      {
        url: "/logo-app.png",
        width: 800,
        height: 800,
        alt: "Verimind Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700&family=Lexend:wght@300;400;500&family=Space+Grotesk:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Providers>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster />
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
