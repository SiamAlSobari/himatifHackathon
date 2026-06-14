import { AlertTriangle, Moon, Smile } from "lucide-react";
import SymptomItem from "./Symptomitem";

interface SymptomAnalysisProps {
  anxietyLevel?: "Rendah" | "Sedang" | "Tinggi";
  insomniaLevel?: "Rendah" | "Sedang" | "Tinggi";
  depressionLevel?: "Rendah" | "Sedang" | "Tinggi";
}

const levelMap = {
  Rendah: { level: 1 as const, color: "teal" as const, text: "Rendah (Low Risk)" },
  Sedang: { level: 2 as const, color: "teal" as const, text: "Sedang (Moderate)" },
  Tinggi: { level: 3 as const, color: "rose" as const, text: "Tinggi (High Risk)" },
};

export default function SymptomAnalysis({
  anxietyLevel = "Rendah",
  insomniaLevel = "Rendah",
  depressionLevel = "Rendah",
}: SymptomAnalysisProps) {
  const anxiety = levelMap[anxietyLevel] || levelMap.Rendah;
  const insomnia = levelMap[insomniaLevel] || levelMap.Rendah;
  const depression = levelMap[depressionLevel] || levelMap.Rendah;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-700">
        Analisis Gejala
      </h3>

      <div className="space-y-3">
        <SymptomItem
          icon={AlertTriangle}
          iconBgClass="bg-amber-50"
          iconColorClass="text-amber-500"
          title="Kecemasan"
          status={anxiety.text}
          level={anxiety.level}
          levelColor={anxiety.color}
        />
        <SymptomItem
          icon={Moon}
          iconBgClass="bg-rose-50"
          iconColorClass="text-rose-500"
          title="Insomnia"
          status={insomnia.text}
          level={insomnia.level}
          levelColor={insomnia.color}
        />
        <SymptomItem
          icon={Smile}
          iconBgClass="bg-slate-100"
          iconColorClass="text-slate-400"
          title="Depresi"
          status={depression.text}
          level={depression.level}
          levelColor={depression.color}
        />
      </div>
    </div>
  );
}