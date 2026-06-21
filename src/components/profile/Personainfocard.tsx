import { User } from "lucide-react";

interface PersonalInfoCardProps {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  onEditPhone?: () => void;
}

export default function PersonalInfoCard({
  fullName,
  email,
  phoneNumber,
  onEditPhone,
}: PersonalInfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-center gap-2">
        <User className="h-4.5 w-4.5 text-slate-400" />
        <h2 className="text-base font-bold text-slate-800">
          Informasi Pribadi
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-xs font-semibold text-slate-400"
          >
            Nama Lengkap
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold text-slate-400"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-1.5 block text-xs font-semibold text-slate-400"
          >
            Nomor Telepon
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={phoneNumber || ""}
            placeholder="Belum ada nomor telepon"
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-400 placeholder:text-slate-300 cursor-not-allowed outline-none"
          />
          <button
            type="button"
            onClick={onEditPhone}
            className="mt-2 text-xs font-bold text-primary hover:underline hover:opacity-85 cursor-pointer text-left inline-block"
          >
            {phoneNumber ? "Ubah nomor telepon?" : "Tambah nomor telepon?"}
          </button>
        </div>
      </div>
    </div>
  );
}