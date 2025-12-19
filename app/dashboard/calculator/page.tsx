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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calculator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your march capacity and the enemy formation. TroopTac returns a recommended formation and win probability.
        </p>
      </div>

      <CalculatorForm
        calculateBattle={calculateBattleAction}
        savePlan={savePlanAction}
        listProfiles={listProfilesAction}
        loadProfile={loadProfileAction}
      />
    </div>
  );
}
