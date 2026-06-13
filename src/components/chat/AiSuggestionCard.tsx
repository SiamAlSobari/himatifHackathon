import { Lightbulb } from "lucide-react";

interface AiSuggestionCardProps {
  title: string;
  message: string;
}

export default function AiSuggestionCard({
  title,
  message,
}: AiSuggestionCardProps) {
  return (
    <div className="rounded-xl bg-slate-100 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-teal-700" />
        <p className="text-sm font-semibold text-teal-800">{title}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-500">{message}</p>
    </div>
  );
}