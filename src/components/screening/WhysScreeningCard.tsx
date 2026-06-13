import { ShieldCheck, CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "Deteksi Dini",
    description:
      "Mengidentifikasi gejala stres atau kecemasan sebelum berkembang lebih jauh.",
  },
  {
    title: "Personalisasi",
    description:
      "Memberikan rekomendasi layanan yang sesuai dengan profil psikologis Anda.",
  },
  {
    title: "Kerahasiaan Data",
    description:
      "Seluruh data Anda dienkripsi dan hanya digunakan untuk keperluan medis.",
  },
];

export default function WhyScreeningCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-teal-700" />
        <h2 className="text-sm font-semibold text-slate-800">
          Mengapa Screening ini Penting?
        </h2>
      </div>

      <ul className="space-y-4">
        {reasons.map((reason) => (
          <li key={reason.title} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {reason.title}
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-500">
                {reason.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}