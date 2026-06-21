import { ChevronRight, CircleHelp, Phone } from "lucide-react";
import { QuickHelpLink } from "@/lib/types/profile";

interface QuickHelpCardProps {
  title: string;
  links: QuickHelpLink[];
}

export default function QuickHelpCard({ title, links }: QuickHelpCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <h2 className="text-base font-bold text-slate-800">{title}</h2>

      <div className="mt-4 flex flex-col gap-1">
        {links.map((link) => {
          const isDanger = link.variant === "danger";
          const Icon = isDanger ? Phone : CircleHelp;

          return (
            <a
              key={link.id}
              href={link.href}
              className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-300 ${
                isDanger
                  ? "text-rose-500 hover:bg-rose-50"
                  : "text-slate-600 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                {link.label}
              </span>
              {!isDanger && <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5" />}
            </a>
          );
        })}
      </div>
    </div>
  );
}