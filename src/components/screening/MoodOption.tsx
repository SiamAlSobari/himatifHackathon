interface MoodOptionProps {
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export default function MoodOption({
  emoji,
  title,
  description,
  selected,
  onSelect,
}: MoodOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
        selected
          ? "border-teal-700 bg-teal-50/60"
          : "border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg">
        {emoji}
      </span>
      <span>
        <span className="block font-semibold text-slate-800">{title}</span>
        <span className="mt-0.5 block text-sm text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}