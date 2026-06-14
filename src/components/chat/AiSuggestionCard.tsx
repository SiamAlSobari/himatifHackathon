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
    <div className="rounded-xl bg-[#EAF6F6] p-4 border border-[#0A5C61]/10">
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#0A5C61]" />
        <p className="text-sm font-semibold text-[#0A5C61]">{title}</p>
      </div>
      <p className="text-sm leading-relaxed text-slate-650">{message}</p>
    </div>
  );
}