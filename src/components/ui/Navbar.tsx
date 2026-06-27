"use client";

import { signOutAction } from "@/app/actions/auth";
import { Bell, LogOut, Search, User2, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useChatSession } from "@/hooks/chat/useChatSession";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data } = useChatSession();
  const session = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: notifications = [] } = useNotifications(session?.data?.user?.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  const isOnboarded = propIsOnboarded !== undefined ? propIsOnboarded : (data?.isOnboarded ?? true);
  const role = (session?.data?.user as any)?.role;

  const finalUserName = userName || session?.data?.user?.name || "Pengguna";
  const finalUserImage = userImage || session?.data?.user?.image || "https://i.pravatar.cc/40?img=12";

  const router = useRouter();
  const profileAction = () => {
    if (role === "PSYCHOLOGY") {
      router.push("/psikolog/profile");
    } else {
      router.push("/profile");
    }
  }

  // Handle auto-closing the profile menu when clicking outside
  const profileMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-3">
          {session?.data?.user && isOnboarded && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors lg:hidden cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-app.png" alt="Verimind Logo" className="h-8 w-auto object-contain" />
            <span className="whitespace-nowrap text-lg font-bold text-teal-900 tracking-tight">
              Verimind
            </span>
          </Link>
        </div>

        {session?.data?.user && isOnboarded && (
          <nav className="hidden items-center gap-7 lg:flex">
            {(role === "PSYCHOLOGY"
              ? [
                { label: "Dashboard", href: "/psikolog" },
                { label: "Konsultasi", href: "/psikolog/konsultasi" },
              ]
              : navItems
            ).map((item) => {
              const isActive = pathname.startsWith(item.href) && item.href !== "/";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${isActive
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
          {session?.data?.user ? (
            <>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  aria-label="Notifikasi"
                  className="relative rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown 
                  isOpen={notificationsOpen} 
                  onClose={() => setNotificationsOpen(false)} 
                />
              </div>

              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label="Menu pengguna"
                  className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80 cursor-pointer"
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
                  <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-2 shadow-lg animate-scale-in duration-300">
                    <div className="px-4 py-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {finalUserName}
                      </p>
                    </div>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => { profileAction(); setMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-600 cursor-pointer"
                    >
                      <User2 className="h-4 w-4" />
                      Profile
                    </button>
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-600 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-teal-900 hover:bg-teal-800 text-white px-4 py-2 rounded-full transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
      </div>
      </div>

      {/* Mobile Nav menu drawer */}
      {mobileMenuOpen && session?.data?.user && isOnboarded && (
        <div className="border-t border-slate-100 bg-white px-6 py-3.5 space-y-1.5 lg:hidden animate-scale-in duration-200 shadow-lg">
          {(role === "PSYCHOLOGY"
            ? [
              { label: "Dashboard", href: "/psikolog" },
              { label: "Konsultasi", href: "/psikolog/konsultasi" },
            ]
            : navItems
          ).map((item) => {
            const isActive = pathname.startsWith(item.href) && item.href !== "/";
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-4 text-sm font-semibold rounded-xl transition-all ${isActive
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}