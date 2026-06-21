"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, User, Calendar, Smile } from "lucide-react";
import ProfileCard from "@/components/profile/Profilecard";
import QuickHelpCard from "@/components/profile/Quickhelpcard";
import PersonalInfoCard from "@/components/profile/Personainfocard";
import AccountSettingsCard from "@/components/profile/Accountsettingcard";
import ConsultationHistoryCard from "@/components/profile/Consultationhistorycard";
import ScreeningTrendsCard from "@/components/profile/ScreeningTrendsCard";
import { useProfile, useUpdateProfile, useUpdatePhoneNumber } from "@/hooks/profile/useProfile";
import { quickHelpLinks } from "./data";

export default function ProfilePage() {
  const router = useRouter();
  const { data, isLoading } = useProfile();
  
  const updateProfileMutation = useUpdateProfile();
  const updatePhoneMutation = useUpdatePhoneNumber();

  // Modal Visibility State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Form Input States
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState<number | "">("");
  const [editGender, setEditGender] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Sync state when data is loaded or modals open
  useEffect(() => {
    if (data?.dbUser) {
      setEditName(data.dbUser.name || "");
      setEditAge(data.dbUser.usia || "");
      setEditGender(data.dbUser.jenisKelamin || "");
      setEditPhone(data.dbUser.kontakDarurat || "");
    }
  }, [data]);

  // Keep routing redirects from MVP
  useEffect(() => {
    if (!isLoading && data) {
      if (!data.dbUser.usia || !data.dbUser.jenisKelamin) {
        router.push("/onboarding");
      } else if (!data.hasScreenedToday) {
        router.push("/screening");
      }
    }
  }, [data, isLoading, router]);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayName = data.dbUser.name || "Pengguna";
  const email = data.dbUser.email || "-";
  const age = data.dbUser.usia || null;
  const phoneNumber = data.dbUser.kontakDarurat || null;

  // Format gender label
  const getGenderLabel = (g: string) => {
    if (g === "LAKI_LAKI" || g === "male") return "Laki-laki";
    if (g === "PEREMPUAN" || g === "female") return "Perempuan";
    if (g === "nonbinary") return "Non-biner";
    if (g === "prefer_not_say") return "Lebih baik tidak menyebutkan";
    return g || "-";
  };

  const handleOpenProfileModal = () => {
    setEditName(data.dbUser.name || "");
    setEditAge(data.dbUser.usia || "");
    setEditGender(data.dbUser.jenisKelamin || "");
    setIsProfileModalOpen(true);
  };

  const handleOpenPhoneModal = () => {
    setEditPhone(data.dbUser.kontakDarurat || "");
    setIsPhoneModalOpen(true);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!editAge || Number(editAge) < 10 || Number(editAge) > 100) {
      toast.error("Usia harus antara 10 - 100 tahun.");
      return;
    }
    if (!editGender) {
      toast.error("Pilih identitas diri terlebih dahulu.");
      return;
    }

    updateProfileMutation.mutate(
      {
        name: editName,
        usia: Number(editAge),
        jenisKelamin: editGender,
      },
      {
        onSuccess: () => {
          toast.success("Profil berhasil diperbarui!");
          setIsProfileModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Gagal memperbarui profil.");
        },
      }
    );
  };

  const handleUpdatePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = editPhone.trim();
    if (!cleanPhone) {
      toast.error("Nomor telepon tidak boleh kosong.");
      return;
    }
    // Simple phone regex validation
    if (!/^\+?[0-9]{9,15}$/.test(cleanPhone)) {
      toast.error("Format nomor telepon tidak valid.");
      return;
    }

    updatePhoneMutation.mutate(cleanPhone, {
      onSuccess: () => {
        toast.success("Nomor telepon berhasil diperbarui!");
        setIsPhoneModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.message || "Gagal memperbarui nomor telepon.");
      },
    });
  };

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
      {/* Upper Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <ProfileCard
            name={displayName}
            age={age}
            location={getGenderLabel(data.dbUser.jenisKelamin)}
            avatarUrl={data.dbUser.image}
            onEdit={handleOpenProfileModal}
          />
          <QuickHelpCard title="Butuh Bantuan?" links={quickHelpLinks} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 h-full">
            <PersonalInfoCard
              fullName={displayName}
              email={email}
              phoneNumber={phoneNumber}
              onEditPhone={handleOpenPhoneModal}
            />
            <AccountSettingsCard initialNotificationsEnabled={false} />
          </div>
        </div>
      </div>

      {/* Real-time Screening Trends Graph */}
      <ScreeningTrendsCard
        trends={data.wellnessTrends}
        metrics={data.metrics}
      />

      {/* Real-time Consultation History Table */}
      <ConsultationHistoryCard
        title="Riwayat Konsultasi"
        viewAllLabel="Lihat Semua"
        items={data.consultationHistory}
      />

      {/* ============================================================ */}
      {/* MODAL 1: UPDATE PROFILE (Name, Age, Gender) */}
      {/* ============================================================ */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[440px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">manage_accounts</span>
                Ubah Profil Anda
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              {/* Usia */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Usia (Tahun)
                </label>
                <input
                  type="number"
                  value={editAge}
                  onChange={(e) => setEditAge(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Contoh: 21"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Smile className="h-3.5 w-3.5 text-slate-400" />
                  Identitas / Jenis Kelamin
                </label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25 cursor-pointer"
                  disabled={updateProfileMutation.isPending}
                >
                  <option value="" disabled>Pilih salah satu</option>
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                  <option value="nonbinary">Non-biner</option>
                  <option value="prefer_not_say">Lebih baik tidak menyebutkan</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={updateProfileMutation.isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: UPDATE PHONE NUMBER */}
      {/* ============================================================ */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-[400px] p-6 soft-bloom animate-scale-in relative border border-slate-100 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">contact_phone</span>
                {phoneNumber ? "Ubah Nomor Telepon" : "Tambah Nomor Telepon"}
              </h3>
              <button
                onClick={() => setIsPhoneModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdatePhone} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Nomor Telepon Aktif / Kontak Darurat
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/25"
                  disabled={updatePhoneMutation.isPending}
                  autoFocus
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Nomor telepon ini digunakan untuk koordinasi pemulihan medis / psikolog jika diperlukan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-50 mt-6">
                <button
                  type="button"
                  onClick={() => setIsPhoneModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={updatePhoneMutation.isPending}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  disabled={updatePhoneMutation.isPending}
                >
                  {updatePhoneMutation.isPending ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}