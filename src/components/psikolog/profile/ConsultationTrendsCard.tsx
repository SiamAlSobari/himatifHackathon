"use client";

import { TrendingUp, BarChart2, CheckCircle, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { AppTheme } from "@/lib/types/theme";
import type {
  PsychologistConsultationTrendItem,
  PsychologistProfileMetrics,
} from "@/lib/types/psychologist-profile";

interface ConsultationTrendsCardProps {
  trends: PsychologistConsultationTrendItem[];
  metrics: PsychologistProfileMetrics;
}

const THEME_COLORS: Record<AppTheme, { stroke: string; fill: string; accent: string; bg: string }> = {
  calm_blue:   { stroke: "#0d9488", fill: "rgba(13,148,136,0.1)", accent: "text-teal-600", bg: "bg-teal-50" },
  warm_yellow: { stroke: "#d97706", fill: "rgba(217,119,6,0.1)",  accent: "text-amber-600", bg: "bg-amber-50" },
  alert_orange:{ stroke: "#ea580c", fill: "rgba(234,88,12,0.1)",  accent: "text-orange-600", bg: "bg-orange-50" },
  deep_purple: { stroke: "#9333ea", fill: "rgba(147,51,234,0.1)", accent: "text-purple-600", bg: "bg-purple-50" },
};

export default function ConsultationTrendsCard({ trends, metrics }: ConsultationTrendsCardProps) {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme] ?? THEME_COLORS.calm_blue;

  const hasData = trends.some((t) => t.sessionCount > 0);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium transition-all duration-300 hover-lift">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.accent}`}>
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800">Tren Sesi Konsultasi Harian</h2>
            <p className="text-xs text-slate-400">Jumlah sesi yang Anda tangani per hari dalam 7 hari terakhir.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1.5 border border-slate-100/50">
          <span className="px-3 py-1 text-xs font-semibold text-slate-500">Live Data</span>
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: <Users className="h-5 w-5" />, label: "Total Sesi", value: `${metrics.totalSessionsHandled}`, color: "text-teal-600 bg-teal-50" },
          { icon: <CheckCircle className="h-5 w-5" />, label: "Selesai", value: `${metrics.completedSessions}`, color: "text-emerald-600 bg-emerald-50" },
          { icon: <BarChart2 className="h-5 w-5" />, label: "Rating", value: `${metrics.rating.toFixed(1)} ★`, color: "text-amber-600 bg-amber-50" },
          { icon: <TrendingUp className="h-5 w-5" />, label: "Pengalaman", value: `${metrics.experienceYears} Thn`, color: "text-indigo-600 bg-indigo-50" },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-3 hover:bg-slate-50 transition-colors">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.color}`}>
              {m.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{m.label}</p>
              <p className="text-base font-extrabold text-slate-700">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        {!hasData ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
            <TrendingUp className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-500">Belum ada sesi terdaftar</p>
            <p className="text-xs text-slate-400 mt-1">Data grafik akan muncul saat Anda mulai menangani sesi konsultasi.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorSession-${theme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={colors.stroke} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.stroke} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{d.day}</p>
                        <p className="mt-1 text-sm font-extrabold text-slate-700">
                          Sesi:{" "}
                          <span style={{ color: colors.stroke }}>{d.sessionCount}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="sessionCount"
                stroke={colors.stroke}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#colorSession-${theme})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
