"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { AppTheme } from "@/lib/types/theme";
import { TrendingUp, Activity, ShieldAlert, Award } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TrendItem {
  day: string;
  score: number;
  wellnessScore: number;
}

interface ScreeningTrendsCardProps {
  trends: TrendItem[];
  metrics: {
    totalConsultations: number;
    averageWellness: number;
    latestCondition: string;
  };
}

const THEME_COLORS: Record<AppTheme, { stroke: string; fill: string; accent: string; text: string; bg: string }> = {
  calm_blue: { stroke: "#0d9488", fill: "rgba(13, 148, 136, 0.1)", accent: "text-teal-600", text: "text-teal-700", bg: "bg-teal-50" },
  warm_yellow: { stroke: "#d97706", fill: "rgba(217, 119, 6, 0.1)", accent: "text-amber-600", text: "text-amber-700", bg: "bg-amber-50" },
  alert_orange: { stroke: "#ea580c", fill: "rgba(234, 88, 12, 0.1)", accent: "text-orange-600", text: "text-orange-700", bg: "bg-orange-50" },
  deep_purple: { stroke: "#9333ea", fill: "rgba(147, 51, 234, 0.1)", accent: "text-purple-600", text: "text-purple-700", bg: "bg-purple-50" },
};

export default function ScreeningTrendsCard({ trends, metrics }: ScreeningTrendsCardProps) {
  const { theme } = useTheme();
  const colors = THEME_COLORS[theme] || THEME_COLORS.calm_blue;

  // Fallback for empty trends
  const hasData = trends && trends.length > 0;
  const displayTrends = hasData ? trends : [
    { day: "Belum ada data", score: 0, wellnessScore: 0 }
  ];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg} ${colors.accent}`}>
            <TrendingUp className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tren Kesehatan Mental & Mood</h2>
            <p className="text-xs text-slate-400">Analisis riwayat kesejahteraan emosional Anda dari screening harian.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-1.5 border border-slate-100/50">
          <span className="px-3 py-1 text-xs font-semibold text-slate-500">Live Data</span>
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600`}>
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Rata-rata Wellness</p>
            <p className="text-xl font-extrabold text-slate-700">{metrics.averageWellness}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600`}>
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Konsultasi Psikolog</p>
            <p className="text-xl font-extrabold text-slate-700">{metrics.totalConsultations} Kali</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-50 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status Terakhir</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{metrics.latestCondition}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-64 w-full">
        {!hasData ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200 p-6 text-center">
            <TrendingUp className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-500">Belum ada riwayat mood terdaftar</p>
            <p className="text-xs text-slate-400 mt-1">Silakan lakukan daily screening di dashboard terlebih dahulu.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayTrends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`colorWellness-${theme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.stroke} stopOpacity={0.4} />
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
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{data.day}</p>
                        <p className="mt-1 text-sm font-extrabold text-slate-700">
                          Wellness Score:{" "}
                          <span style={{ color: colors.stroke }}>{data.wellnessScore}%</span>
                        </p>
                        <p className="text-[10px] text-slate-400">DASS-28 score: {data.score}/21</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="wellnessScore"
                stroke={colors.stroke}
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#colorWellness-${theme})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
