"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Kenali", href: "/screening" },
  { label: "Validasi", href: "/chat" }
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <span className="text-lg font-bold text-teal-900">Jembatan Aman</span>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-teal-700"
                    : "text-slate-600 hover:text-teal-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifikasi"
            className="text-slate-500 hover:text-slate-700"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Image
            src="https://i.pravatar.cc/40?img=12"
            alt="Foto profil pengguna"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}