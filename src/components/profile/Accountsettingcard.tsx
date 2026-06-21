"use client";

import { ChevronRight, Settings, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface AccountSettingsCardProps {
  initialNotificationsEnabled?: boolean;
  onUpdatePassword?: () => void;
}

export default function AccountSettingsCard({
  initialNotificationsEnabled = false,
  onUpdatePassword,
}: AccountSettingsCardProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    initialNotificationsEnabled
  );

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center gap-2">
        <Settings className="h-4.5 w-4.5 text-slate-400" />
        <h2 className="text-base font-bold text-slate-800">
          Pengaturan Akun
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-700">Notifikasi</p>
            <p className="text-xs text-slate-400 font-medium">Push &amp; Email Reminder</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={() => setNotificationsEnabled((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-300 cursor-pointer ${
              notificationsEnabled ? "bg-primary" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                notificationsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={onUpdatePassword}
          className="flex items-center justify-between rounded-xl px-1 py-1 text-left transition-colors cursor-pointer hover:text-primary group w-full"
        >
          <span className="flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors group-hover:text-primary">
            <ShieldCheck className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary" />
            Ubah Kata Sandi
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-primary group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}