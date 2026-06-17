"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./footer";
import { footerLinkGroups } from "@/app/dashboard/data";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define paths where Navbar and Footer should NOT be displayed
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/psikolog/login" ||
    pathname === "/psikolog/register" ||
    pathname === "/onboarding";

  if (isAuthPath) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex-1 w-full">{children}</div>
      <Footer linkGroups={footerLinkGroups} />
    </div>
  );
}
