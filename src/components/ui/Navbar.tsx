import { Bell } from "lucide-react";

export default function Navbar() {
  const navItems = [
    { label: "Home", active: false },
    { label: "Kenali", active: true },
    { label: "Validasi", active: false },
    { label: "Arahkan", active: false },
  ];

  return (
    <header className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <span className="text-lg font-bold text-teal-900">Jembatan Aman</span>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`text-sm font-medium transition-colors ${
                item.active
                  ? "text-teal-700"
                  : "text-slate-600 hover:text-teal-700"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifikasi"
            className="text-slate-500 hover:text-slate-700"
          >
            <Bell className="h-5 w-5" />
          </button>
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Foto profil pengguna"
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}