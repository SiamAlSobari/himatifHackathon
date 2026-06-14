import { Globe, Phone, Share2 } from "lucide-react";
import { FooterLinkGroup } from "@/lib/types/dashboard";

interface FooterProps {
  linkGroups: FooterLinkGroup[];
}

export default function Footer({ linkGroups }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-bold text-teal-900">
              Jembatan Aman
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Platform pertolongan pertama psikologis yang menghubungkan Anda
              dengan profesional secara aman dan terpercaya.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="#"
                aria-label="Website"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-teal-200 hover:text-teal-600"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Bagikan"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-teal-200 hover:text-teal-600"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-teal-700"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Bantuan Darurat
            </h3>
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-xs text-slate-500">Layanan 24/7</p>
              <a
                href="tel:119"
                className="mt-1 flex items-center gap-2 text-lg font-bold text-rose-500"
              >
                <Phone className="h-4 w-4" />
                119
              </a>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Segera hubungi jika Anda dalam situasi krisis.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© 2024 Jembatan Aman. Psychological First Aid Platform.</p>
          <p>Terdaftar di Kemenkes RI</p>
        </div>
      </div>
    </footer>
  );
}