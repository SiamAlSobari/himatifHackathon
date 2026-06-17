"use client";

import ClientListHeader from "@/components/clientlist/Clientlistheader";
import ClientListGrid from "@/components/clientlist/Clientlistgrid";
import { usePsychologistClients } from "@/hooks/psychologist/usePsychologistClients";

export default function ListClientPage() {
  const { data: clients, isLoading, error } = usePsychologistClients();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <ClientListHeader
        title="List Client"
        description="Kelola seluruh data client dengan lebih cepat, rapi, dan efisien."
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-800">
          Gagal memuat daftar klien. Silakan coba lagi nanti.
        </div>
      ) : clients && clients.length > 0 ? (
        <ClientListGrid clients={clients} />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-slate-300">
            group_off
          </span>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            Belum ada daftar klien
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Klien baru akan muncul di sini setelah menjadwalkan sesi konsultasi
            dengan Anda.
          </p>
        </div>
      )}
    </main>
  );
}
