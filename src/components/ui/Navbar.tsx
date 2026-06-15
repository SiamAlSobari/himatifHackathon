"use client";

import { signOutAction } from "@/app/actions/auth";
import { Bell, LogOut, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useChatSession } from "@/hooks/chat/useChatSession";
import { useSession } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Validasi", href: "/validasi" },
  { label: "Arahkan", href: "/arahkan" }
];

interface NavbarProps {
  userName?: string | null;
  userImage?: string | null;
  isOnboarded?: boolean;
}

export default function Navbar({ userName, userImage, isOnboarded: propIsOnboarded }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { data } = useChatSession();
  const session = useSession();
  const isOnboarded = propIsOnboarded !== undefined ? propIsOnboarded : (data?.isOnboarded ?? true);

  const finalUserName = userName || session?.data?.user?.name || "Pengguna";
  const finalUserImage = userImage || session?.data?.user?.image || "https://i.pravatar.cc/40?img=12";

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <span className="whitespace-nowrap text-lg font-bold text-teal-900">
          Jembatan Aman
        </span>

        {isOnboarded && (
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && item.href !== "/";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-teal-700"
                      : "text-slate-500 hover:text-teal-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative hidden w-full max-w-xs md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari layanan atau artikel..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-600 placeholder:text-slate-400 outline-none transition-colors focus:border-teal-300 focus:bg-white"
            />
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Menu pengguna"
              className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
            >
              <Image
                src={finalUserImage}
                alt={finalUserName || "Foto profil pengguna"}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-lg">
                <div className="px-4 py-2">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {finalUserName}
                  </p>
                </div>
                <div className="my-1 border-t border-slate-100" />
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}