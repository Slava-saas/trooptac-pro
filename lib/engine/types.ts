// lib/engine/types.ts

export type UnitCode = string; // z.B. "Infantry_1", "Vehicles_3", ...

export interface MarchPayload {
  [unitCode: UnitCode]: number;
}

export interface BattleResult {
  scoreYou: number;
  scoreEnemy: number;
  winProbability: number;
  details: Record<string, unknown>;
}
