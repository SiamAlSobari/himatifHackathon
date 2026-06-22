"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./footer";
import { footerLinkGroups } from "@/app/dashboard/data";
import { useSession } from "next-auth/react";
import NotificationMobileToast from "./NotificationMobileToast";
import NotificationSimulator from "./NotificationSimulator";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Define paths where Navbar and Footer should NOT be displayed
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/psikolog/login" ||
    pathname === "/psikolog/register" ||
    pathname === "/onboarding";

  // Define paths where Footer should NOT be displayed (e.g. Chat pages to avoid scrolling the main page)
  const isChatPath =
    pathname === "/validasi" ||
    pathname === "/konsultasi" ||
    pathname === "/psikolog/konsultasi" ||
    pathname === "/riwayatkonsultasi";

  if (isAuthPath) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 w-full min-h-0">{children}</div>
      {!isChatPath && <Footer linkGroups={footerLinkGroups} />}
      <NotificationMobileToast />
      <NotificationSimulator />
    </div>
  );
}
