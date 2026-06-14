import { ChevronRight, CircleHelp, Phone } from "lucide-react";
import { QuickHelpLink } from "@/lib/types/profile";

interface QuickHelpCardProps {
  title: string;
  links: QuickHelpLink[];
}

export default function QuickHelpCard({ title, links }: QuickHelpCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>

      <div className="mt-4 flex flex-col gap-1">
        {links.map((link) => {
          const isDanger = link.variant === "danger";
          const Icon = isDanger ? Phone : CircleHelp;

          return (
            <a
              key={link.id}
              href={link.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isDanger
                  ? "text-rose-500 hover:bg-rose-50"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                {link.label}
              </span>
              {!isDanger && <ChevronRight className="h-4 w-4 text-slate-300" />}
            </a>
          );
        })}
      </div>
    </div>
  );
}