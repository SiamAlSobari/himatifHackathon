import { LayoutGrid } from "lucide-react";
import WellbeingScoreCard from "./Wellbeingscorecard";
import SymptomAnalysis from "./Symptomanalysis";
import AiSuggestionCard from "./AiSuggestionCard";
import EmergencyHelpSection from "./Emergencyhelpsection";
import { ChatMessage, Screening } from "@/lib/types/chat";

interface SummarySidebarProps {
  latestAssistantMessage: ChatMessage | null;
  latestScreening: Screening | null;
}

export default function SummarySidebar({
  latestAssistantMessage,
  latestScreening,
}: SummarySidebarProps) {
  // Wellbeing score calculation based on screening score (out of 21)
  const score = latestScreening
    ? Math.max(0, Math.round(((21 - latestScreening.score) / 21) * 100))
    : 100;

  // Dynamic description for wellbeing score
  const getDescription = (scoreVal: number) => {
    if (!latestScreening) {
      return "Lakukan screening kesehatan mental terlebih dahulu untuk mendapatkan skor kesejahteraan.";
    }
    if (latestScreening.score <= 4) {
      return "Kondisi emosional Anda stabil. Pertahankan kebiasaan baik Anda.";
    }
    if (latestScreening.score <= 9) {
      return "Ada sedikit tanda kelelahan atau stres. Luangkan waktu untuk istirahat.";
    }
    if (latestScreening.score <= 13) {
      return "Membutuhkan perhatian pada manajemen stres dan kualitas tidur.";
    }
    return "Tingkat stres/kecemasan tinggi. Pertimbangkan untuk berbicara dengan profesional.";
  };

  const description = getDescription(score);

  // Default levels derived from screening score if assistant hasn't sent any messages
  const getDefaultsFromScore = (scoreVal?: number) => {
    if (scoreVal === undefined || scoreVal === null) {
      return {
        anxiety: "Rendah" as const,
        depression: "Rendah" as const,
        insomnia: "Rendah" as const,
      };
    }
    if (scoreVal <= 4) {
      return {
        anxiety: "Rendah" as const,
        depression: "Rendah" as const,
        insomnia: "Rendah" as const,
      };
    }
    if (scoreVal <= 9) {
      return {
        anxiety: "Sedang" as const,
        depression: "Rendah" as const,
        insomnia: "Rendah" as const,
      };
    }
    if (scoreVal <= 13) {
      return {
        anxiety: "Sedang" as const,
        depression: "Sedang" as const,
        insomnia: "Sedang" as const,
      };
    }
    return {
      anxiety: "Tinggi" as const,
      depression: "Tinggi" as const,
      insomnia: "Tinggi" as const,
    };
  };

  const defaults = getDefaultsFromScore(latestScreening?.score);

  // Extracted levels from assistant metadata
  const anxietyLevel =
    latestAssistantMessage?.metaData?.analysis?.anxietyLevel || defaults.anxiety;
  const insomniaLevel =
    latestAssistantMessage?.metaData?.analysis?.insomniaLevel || defaults.insomnia;
  const depressionLevel =
    latestAssistantMessage?.metaData?.analysis?.depressionLevel || defaults.depression;

  // AI Suggestion
  const aiSuggestion =
    latestAssistantMessage?.metaData?.analysis?.aiValidationAdvice ||
    "Ceritakan perasaanmu untuk mendapatkan saran validasi AI.";

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-teal-800" />
        <h2 className="text-base font-semibold text-slate-800">
          Ringkasan Kenali
        </h2>
      </div>

      <WellbeingScoreCard
        score={score}
        maxScore={100}
        description={description}
      />

      <SymptomAnalysis
        anxietyLevel={anxietyLevel}
        insomniaLevel={insomniaLevel}
        depressionLevel={depressionLevel}
      />

      <AiSuggestionCard title="Saran Validasi AI" message={aiSuggestion} />

      <div className="flex-1" />

      <EmergencyHelpSection />
    </aside>
  );
}