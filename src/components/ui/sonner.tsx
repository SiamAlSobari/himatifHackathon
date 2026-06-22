"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { 
  CircleCheckIcon, 
  InfoIcon, 
  TriangleAlertIcon, 
  OctagonXIcon, 
  Loader2Icon 
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  const iconColors = {
    calm_blue: {
      success: "text-teal-600",
      info: "text-sky-600",
      warning: "text-amber-500",
      error: "text-rose-600",
      loading: "text-teal-600",
      border: "group-[.toaster]:border-l-teal-600"
    },
    warm_yellow: {
      success: "text-amber-600",
      info: "text-sky-600",
      warning: "text-orange-500",
      error: "text-rose-600",
      loading: "text-amber-600",
      border: "group-[.toaster]:border-l-amber-600"
    },
    alert_orange: {
      success: "text-orange-600",
      info: "text-sky-600",
      warning: "text-red-500",
      error: "text-rose-600",
      loading: "text-orange-600",
      border: "group-[.toaster]:border-l-orange-600"
    },
    deep_purple: {
      success: "text-indigo-600",
      info: "text-sky-600",
      warning: "text-purple-500",
      error: "text-rose-600",
      loading: "text-indigo-600",
      border: "group-[.toaster]:border-l-indigo-600"
    }
  };

  const colors = iconColors[theme] || iconColors.calm_blue;

  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className={`size-5 shrink-0 ${colors.success}`} />
        ),
        info: (
          <InfoIcon className={`size-5 shrink-0 ${colors.info}`} />
        ),
        warning: (
          <TriangleAlertIcon className={`size-5 shrink-0 ${colors.warning}`} />
        ),
        error: (
          <OctagonXIcon className={`size-5 shrink-0 ${colors.error}`} />
        ),
        loading: (
          <Loader2Icon className={`size-5 shrink-0 animate-spin ${colors.loading}`} />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: `group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-800 border group-[.toaster]:border-slate-100 group-[.toaster]:shadow-lg rounded-2xl p-4 font-sans border-l-4 ${colors.border} flex items-center gap-3`,
          title: "text-xs font-bold text-slate-800",
          description: "text-[11px] text-slate-500 font-medium",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
