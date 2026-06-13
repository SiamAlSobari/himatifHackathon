import WhyScreeningCard from "./WhysScreeningCard";
import ExpertValidationCard from "./ExpertValidationCard";
import CrisisHelpCard from "./Crisishelpcard";

export default function InfoSidebar() {
  return (
    <aside className="space-y-4">
      <WhyScreeningCard />
      <ExpertValidationCard />
      <CrisisHelpCard />
    </aside>
  );
}