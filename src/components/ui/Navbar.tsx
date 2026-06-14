"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Kenali", href: "/screening" },
  { label: "Validasi", href: "/chat" },
  { label: "Arahkan", href: "/recommendation" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-teal-900">
          Jembatan <span className="text-[#0A5C61]">Aman</span>
        </Link>

        {/* Navigation & Search */}
        <div className="flex h-full items-center gap-8">
          <nav className="hidden h-full items-center gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex h-full items-center text-sm font-semibold transition-colors border-b-2 px-1 ${
                    isActive
                      ? "text-[#0A5C61] border-[#0A5C61] font-bold"
                      : "border-transparent text-slate-600 hover:text-[#0A5C61]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action controls (Search, Notification, Profile) */}
        <div className="flex items-center gap-4">
          <div className="relative hidden w-64 md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Cari layanan atau artikel..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#0A5C61] focus:bg-white transition-all"
            />
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            className="rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <Bell className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            aria-label="Profil"
            className="rounded-full overflow-hidden border border-slate-200 shadow-sm transition-transform hover:scale-105"
          >
            <Image
              src="https://i.pravatar.cc/40?img=12"
              alt="Foto profil pengguna"
              width={32}
              height={32}
              className="h-8 w-8 object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}