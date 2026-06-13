interface DateDividerProps {
  label: string;
}

export default function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="flex justify-center py-2">
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
        {label}
      </span>
    </div>
  );
}