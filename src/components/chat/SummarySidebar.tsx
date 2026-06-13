import { LayoutGrid } from "lucide-react";
import WellbeingScoreCard from "./Wellbeingscorecard";
import SymptomAnalysis from "./Symptomanalysis";
import AiSuggestionCard from "./AiSuggestionCard";
import EmergencyHelpSection from "./Emergencyhelpsection";

export default function SummarySidebar() {
  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-teal-800" />
        <h2 className="text-base font-semibold text-slate-800">
          Ringkasan Kenali
        </h2>
      </div>

      <WellbeingScoreCard
        score={64}
        maxScore={100}
        description="Membutuhkan perhatian pada manajemen stres dan kualitas tidur."
      />

      <SymptomAnalysis />

      <AiSuggestionCard
        title="Saran Validasi AI"
        message="Gunakan teknik pernapasan 4-7-8 sebelum tidur untuk membantu menenangkan sistem saraf otonom Anda."
      />

      <div className="flex-1" />

      <EmergencyHelpSection />
    </aside>
  );
}