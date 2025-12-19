// app/dashboard/calculator/page.tsx
import {
  calculateBattleAction,
  savePlanAction,
  listProfilesAction,
  loadProfileAction,
} from "./actions";
import { CalculatorForm } from "./CalculatorForm";

export default function CalculatorPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Calculator</h1>
      <CalculatorForm
        calculateBattle={calculateBattleAction}
        savePlan={savePlanAction}
        listProfiles={listProfilesAction}
        loadProfile={loadProfileAction}
      />
    </div>
  );
}
