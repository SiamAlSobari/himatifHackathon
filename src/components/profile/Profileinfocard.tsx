import { User } from "lucide-react";

interface PersonalInfoCardProps {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
}

export default function PersonalInfoCard({
  fullName,
  email,
  phoneNumber,
}: PersonalInfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <User className="h-4.5 w-4.5 text-slate-400" />
        <h2 className="text-base font-semibold text-slate-800">
          Informasi Pribadi
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            Nama Lengkap
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            defaultValue={fullName}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-teal-300 focus:ring-1 focus:ring-teal-200"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={email}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-teal-300 focus:ring-1 focus:ring-teal-200"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="mb-1.5 block text-xs font-medium text-slate-500"
          >
            Nomor Telepon
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            defaultValue={phoneNumber || ""}
            placeholder="+62 8xx-xxxx-xxxx"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-300 outline-none transition-colors focus:border-teal-300 focus:ring-1 focus:ring-teal-200"
          />
        </div>
      </div>
    </div>
  );
}