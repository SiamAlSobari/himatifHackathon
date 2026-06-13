import Image from "next/image";

export default function ExpertValidationCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <Image
          src="https://i.pravatar.cc/40?img=47"
          alt="Foto Dr. Sarah Wijaya"
          width="100"
          height="100"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Divalidasi Oleh Ahli
          </p>
          <p className="text-sm font-semibold text-slate-800">
            Dr. Sarah Wijaya, Sp.KJ
          </p>
        </div>
      </div>

      <p className="text-sm italic leading-relaxed text-slate-500">
        &ldquo;Screening ini menggunakan standar GAD-7 dan PHQ-9 yang diakui
        klinis oleh Himpunan Psikologi Indonesia.&rdquo;
      </p>
    </div>
  );
}