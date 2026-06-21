import React, { useState } from "react";
import { Search, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { ConsultationHistoryListItem } from "@/lib/types/consultation-history";

interface HistorySidebarProps {
  items: ConsultationHistoryListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export default function HistorySidebar({
  items,
  selectedId,
  onSelect,
  isLoading,
}: HistorySidebarProps) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
    item.otherPartyName.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-r border-slate-100 bg-white shadow-sm">
      {/* Search Header */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight mb-3">
          Riwayat Konsultasi
        </h2>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-4 pl-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1.5 scrollbar-thin">
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-slate-400">Memuat riwayat...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center p-4 text-center">
            <Calendar className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-500">Tidak ada riwayat</p>
            <p className="text-xs text-slate-400">Belum ada riwayat sesi yang ditemukan</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-start gap-3.5 p-3 rounded-xl transition-all text-left outline-none ${
                  isSelected
                    ? "bg-primary/10 border-l-4 border-primary text-primary-fixed-dim"
                    : "hover:bg-slate-50 border-l-4 border-transparent text-slate-700 hover:text-slate-900"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {item.otherPartyImage ? (
                    <img
                      src={item.otherPartyImage}
                      alt={item.otherPartyName}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary border border-primary/20">
                      {getInitials(item.otherPartyName)}
                    </div>
                  )}
                  {/* Status Indicator inside/on avatar */}
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
                    {item.status === "COMPLETED" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-white" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-500 fill-white" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold text-sm truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                      {item.otherPartyName}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium truncate mb-1">
                    {item.otherPartyRole || "Klien"}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {formatDate(item.scheduledAt)}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      {item.status === "COMPLETED" ? "Selesai" : "Batal"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
