import { AlertTriangle, Moon, Smile } from "lucide-react";
import SymptomItem from "./Symptomitem";

export default function SymptomAnalysis() {
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
          status="Sedang (Moderate)"
          level={2}
          levelColor="teal"
        />
        <SymptomItem
          icon={Moon}
          iconBgClass="bg-rose-50"
          iconColorClass="text-rose-500"
          title="Insomnia"
          status="Tinggi (High Risk)"
          level={3}
          levelColor="rose"
        />
        <SymptomItem
          icon={Smile}
          iconBgClass="bg-slate-100"
          iconColorClass="text-slate-400"
          title="Depresi"
          status="Rendah (Low Risk)"
          level={1}
          levelColor="teal"
        />
      </div>
    </div>
  );
}