import { ArrowRight, BookHeart, Wind } from "lucide-react";
import { ActivityRecommendation } from "@/lib/types/dashboard";

interface ActivityCardProps {
  title: string;
  description: string;
  subtitle: string;
  items: ActivityRecommendation[];
}

const ICONS: Record<ActivityRecommendation["icon"], typeof Wind> = {
  meditation: Wind,
  journal: BookHeart,
};

const ICON_STYLES: Record<ActivityRecommendation["icon"], string> = {
  meditation: "bg-sky-50 text-sky-500",
  journal: "bg-rose-50 text-rose-400",
};

const LINK_STYLES: Record<ActivityRecommendation["icon"], string> = {
  meditation: "text-teal-600 hover:text-teal-700",
  journal: "text-rose-500 hover:text-rose-600",
};

function ActivityTile({ title, description, ctaLabel, icon }: ActivityRecommendation) {
  const Icon = ICONS[icon];

  return (
    <div className="flex flex-1 flex-col gap-3 rounded-xl border border-slate-100 p-4 transition-colors hover:border-slate-200">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full ${ICON_STYLES[icon]}`}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        className={`mt-auto flex items-center gap-1 text-xs font-semibold transition-colors ${LINK_STYLES[icon]}`}
      >
        {ctaLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function ActivityCard({
  title,
  description,
  subtitle,
  items,
}: ActivityCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      <p className="mt-1 text-xs text-slate-400">{subtitle || description}</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {items.map((item) => (
          <ActivityTile key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}