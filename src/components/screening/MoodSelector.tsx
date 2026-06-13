"use client";

import { useState } from "react";
import MoodOption from "./MoodOption";

const moodOptions = [
  {
    id: "sangat-baik",
    emoji: "😄",
    title: "Sangat Baik",
    description: "Merasa produktif dan tenang.",
  },
  {
    id: "baik",
    emoji: "🙂",
    title: "Baik",
    description: "Kondisi stabil dan terkendali.",
  },
  {
    id: "biasa-saja",
    emoji: "😐",
    title: "Biasa Saja",
    description: "Tidak ada perubahan signifikan.",
  },
  {
    id: "kurang-baik",
    emoji: "😕",
    title: "Kurang Baik",
    description: "Merasa sedikit cemas atau lelah.",
  },
  {
    id: "sangat-buruk",
    emoji: "😢",
    title: "Sangat Buruk",
    description: "Membutuhkan bantuan segera.",
  },
  {
    id: "lainnya",
    emoji: "❓",
    title: "Lainnya",
    description: "Sulit mendefinisikan perasaan.",
  },
];

interface MoodSelectorProps {
  onContinue: (selectedId: string | null) => void;
  onSaveForLater: () => void;
}

export default function MoodSelector({
  onContinue,
  onSaveForLater,
}: MoodSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">
        Bagaimana perasaan Anda hari ini?
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
        Pilih satu yang paling menggambarkan keadaan emosional Anda saat ini
        untuk membantu kami memberikan rekomendasi yang tepat.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {moodOptions.map((option) => (
          <MoodOption
            key={option.id}
            emoji={option.emoji}
            title={option.title}
            description={option.description}
            selected={selectedId === option.id}
            onSelect={() => setSelectedId(option.id)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onContinue(selectedId)}
          className="rounded-lg bg-teal-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
        >
          Lanjutkan
        </button>
        <button
          type="button"
          onClick={onSaveForLater}
          className="rounded-lg border border-teal-900 px-6 py-3 text-sm font-semibold text-teal-900 transition-colors hover:bg-teal-50"
        >
          Simpan untuk Nanti
        </button>
      </div>
    </section>
  );
}