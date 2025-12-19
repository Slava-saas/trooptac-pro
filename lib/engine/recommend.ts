import unitsRaw from "./units.json";
import { evaluateBattle } from "./core";
import type { BattleResult } from "./types";

const UNIT_TYPES = ["Infantry", "Vehicles", "Distance", "Battery"] as const;
type UnitType = (typeof UNIT_TYPES)[number];

type MarchPayload = Record<string, number>;

const units: any = (unitsRaw as any).units ?? (unitsRaw as any);

function maxTierBySubtype(type: UnitType): Array<{ subtype: string; tier: number }> {
  const map = new Map<string, number>();
  const byTier = units?.[type] ?? {};

  for (const [tierStr, def] of Object.entries<any>(byTier)) {
    const tier = Number(tierStr);
    const subtype = def?.subtype;
    if (!subtype || !Number.isFinite(tier)) continue;
    map.set(subtype, Math.max(map.get(subtype) ?? 0, tier));
  }

  const list = Array.from(map.entries()).map(([subtype, tier]) => ({ subtype, tier }));
  // Fallback: wenn subtype-map leer ist, nimm höchste Tier-Zahl die existiert
  if (list.length === 0) {
    const tiers = Object.keys(byTier).map(Number).filter(Number.isFinite).sort((a, b) => b - a);
    const tier = tiers[0] ?? 12;
    return [{ subtype: "unknown", tier }];
  }

  return list.sort((a, b) => b.tier - a.tier);
}

function sharePatterns(stepPct = 20): Array<Record<UnitType, number>> {
  const out: Array<Record<UnitType, number>> = [];
  for (let i = 0; i <= 100; i += stepPct) {
    for (let v = 0; v <= 100 - i; v += stepPct) {
      for (let d = 0; d <= 100 - i - v; d += stepPct) {
        const b = 100 - i - v - d;
        if (b < 0) continue;
        if (b % stepPct !== 0) continue;

        out.push({
          Infantry: i,
          Vehicles: v,
          Distance: d,
          Battery: b,
        });
      }
    }
  }
  // Stabil: erst Balanced, dann Rest
  out.sort((a, b) => {
    const da = Math.abs(a.Infantry - 25) + Math.abs(a.Vehicles - 25) + Math.abs(a.Distance - 25) + Math.abs(a.Battery - 25);
    const db = Math.abs(b.Infantry - 25) + Math.abs(b.Vehicles - 25) + Math.abs(b.Distance - 25) + Math.abs(b.Battery - 25);
    return da - db;
  });
  return out;
}

function allocateTotals(cap: number, shares: Record<UnitType, number>): Record<UnitType, number> {
  const items = UNIT_TYPES.map((t) => {
    const exact = (cap * shares[t]) / 100;
    const base = Math.floor(exact);
    return { t, exact, base, frac: exact - base };
  });

  let used = items.reduce((s, x) => s + x.base, 0);
  let rem = cap - used;

  items.sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < items.length && rem > 0; k++, rem--) items[k].base += 1;

  const out = {} as Record<UnitType, number>;
  for (const it of items) out[it.t] = it.base;
  return out;
}

function better(a: BattleResult, b: BattleResult): boolean {
  if (a.winProbability !== b.winProbability) return a.winProbability > b.winProbability;
  return a.scoreYou > b.scoreYou;
}

export function recommendMarch(capYou: number, enemyMarch: MarchPayload): { recommendedMarch: MarchPayload; result: BattleResult } {
  if (!Number.isFinite(capYou) || capYou <= 0) {
    // harte Validierung, UI zeigt Fehlertext
    throw new Error("Enter your march capacity (cap_you) to get a recommended formation.");
  }

  const subtypeChoices: Record<UnitType, Array<{ subtype: string; tier: number }>> = {
    Infantry: maxTierBySubtype("Infantry"),
    Vehicles: maxTierBySubtype("Vehicles"),
    Distance: maxTierBySubtype("Distance"),
    Battery: maxTierBySubtype("Battery"),
  };

  const patterns = sharePatterns(20);

  let bestResult: BattleResult | null = null;
  let bestMarch: MarchPayload | null = null;

  for (const pat of patterns) {
    const totals = allocateTotals(capYou, pat);

    const infList = totals.Infantry > 0 ? subtypeChoices.Infantry : [{ subtype: "none", tier: 0 }];
    const vehList = totals.Vehicles > 0 ? subtypeChoices.Vehicles : [{ subtype: "none", tier: 0 }];
    const disList = totals.Distance > 0 ? subtypeChoices.Distance : [{ subtype: "none", tier: 0 }];
    const batList = totals.Battery > 0 ? subtypeChoices.Battery : [{ subtype: "none", tier: 0 }];

    for (const inf of infList) {
      for (const veh of vehList) {
        for (const dis of disList) {
          for (const bat of batList) {
            const marchYou: MarchPayload = {};

            if (totals.Infantry > 0) marchYou[`Infantry_${inf.tier}`] = totals.Infantry;
            if (totals.Vehicles > 0) marchYou[`Vehicles_${veh.tier}`] = totals.Vehicles;
            if (totals.Distance > 0) marchYou[`Distance_${dis.tier}`] = totals.Distance;
            if (totals.Battery > 0) marchYou[`Battery_${bat.tier}`] = totals.Battery;

            const res = evaluateBattle(marchYou, enemyMarch);

            if (!bestResult || better(res, bestResult)) {
              bestResult = res;
              bestMarch = marchYou;
            }
          }
        }
      }
    }
  }

  // patterns ist nie leer; dennoch safe fallback
  if (!bestResult || !bestMarch) {
    const marchYou = { Infantry_12: capYou };
    const res = evaluateBattle(marchYou, enemyMarch);
    return { recommendedMarch: marchYou, result: res };
  }

  return { recommendedMarch: bestMarch, result: bestResult };
}
