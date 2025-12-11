// app/dashboard/calculator/page.tsx
import { calculateBattleAction, savePlanAction } from "./actions";
import { CalculatorForm } from "./CalculatorForm";

export default function CalculatorPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Calculator</h1>
      <CalculatorForm
        calculateBattle={calculateBattleAction}
        savePlan={savePlanAction}
      />
    </div>
  );
}
