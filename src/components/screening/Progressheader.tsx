interface ProgressHeaderProps {
  step: number;
  totalSteps: number;
  category: string;
}

export default function ProgressHeader({
  step,
  totalSteps,
  category,
}: ProgressHeaderProps) {
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Kemajuan Anda
        </span>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          {category}
        </span>
      </div>

      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-teal-700 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-sm font-medium text-slate-600">
        Langkah {step} dari {totalSteps}
      </p>
    </div>
  );
}