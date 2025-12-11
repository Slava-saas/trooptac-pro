// lib/engine/core.ts

import { ENGINE_VERSION, K_FRONT, SYNERGY_BONUS, SYNERGY_MALUS, MONO_THRESHOLD, MONO_MALUS } from "./constants";
import type { MarchPayload, BattleResult } from "./types";

type UnitType = "Infantry" | "Vehicles" | "Distance" | "Battery";

interface UnitDef {
  subtype: string;
  P_base: number;
}

interface ParsedUnit {
  type: UnitType;
  tier: number;
  count: number;
}

interface EnemyWall {
  type: UnitType | null;
  tier: number | null;
  subtype: string | null;
}

const LOGISTIC_ALPHA = 4;

const UNIT_DEFS: Record<UnitType, Record<number, UnitDef>> = {
  Infantry: {
    1: { subtype: "Machine Gunner", P_base: 10 },
    2: { subtype: "Submachine Gunner", P_base: 13 },
    3: { subtype: "Machine Gunner", P_base: 17 },
    4: { subtype: "Submachine Gunner", P_base: 22 },
    5: { subtype: "Machine Gunner", P_base: 29 },
    6: { subtype: "Submachine Gunner", P_base: 37 },
    7: { subtype: "Machine Gunner", P_base: 48 },
    8: { subtype: "Submachine Gunner", P_base: 63 },
    9: { subtype: "Machine Gunner", P_base: 82 },
    10: { subtype: "Submachine Gunner", P_base: 106 },
    11: { subtype: "Machine Gunner", P_base: 138 },
    12: { subtype: "Submachine Gunner", P_base: 194 },
  },
  Vehicles: {
    1: { subtype: "Tank", P_base: 10 },
    2: { subtype: "Jeep", P_base: 13 },
    3: { subtype: "Tank", P_base: 17 },
    4: { subtype: "Tank", P_base: 22 },
    5: { subtype: "Jeep", P_base: 29 },
    6: { subtype: "Tank", P_base: 37 },
    7: { subtype: "Jeep", P_base: 48 },
    8: { subtype: "Tank", P_base: 63 },
    9: { subtype: "Jeep", P_base: 82 },
    10: { subtype: "Jeep", P_base: 106 },
    11: { subtype: "Tank", P_base: 138 },
    12: { subtype: "Jeep", P_base: 194 },
  },
  Distance: {
    1: { subtype: "Launcher", P_base: 10 },
    2: { subtype: "Sniper", P_base: 13 },
    3: { subtype: "Sniper", P_base: 17 },
    4: { subtype: "Launcher", P_base: 22 },
    5: { subtype: "Sniper", P_base: 29 },
    6: { subtype: "Sniper", P_base: 37 },
    7: { subtype: "Launcher", P_base: 48 },
    8: { subtype: "Launcher", P_base: 63 },
    9: { subtype: "Sniper", P_base: 82 },
    10: { subtype: "Launcher", P_base: 106 },
    11: { subtype: "Sniper", P_base: 138 },
    12: { subtype: "Launcher", P_base: 194 },
  },
  Battery: {
    1: { subtype: "Carrier", P_base: 10 },
    2: { subtype: "Artillery", P_base: 13 },
    3: { subtype: "Carrier", P_base: 17 },
    4: { subtype: "Artillery", P_base: 22 },
    5: { subtype: "Carrier", P_base: 29 },
    6: { subtype: "Artillery", P_base: 37 },
    7: { subtype: "Artillery", P_base: 48 },
    8: { subtype: "Carrier", P_base: 63 },
    9: { subtype: "Artillery", P_base: 82 },
    10: { subtype: "Carrier", P_base: 106 },
    11: { subtype: "Artillery", P_base: 138 },
    12: { subtype: "Carrier", P_base: 194 },
  },
};

function parseUnitCode(code: string): { type: UnitType; tier: number } | null {
  const [rawType, rawTier] = code.split("_");
  if (!rawType || !rawTier) return null;

  const tier = Number(rawTier);
  if (!Number.isInteger(tier) || tier < 1 || tier > 12) return null;

  const type = rawType as UnitType;
  if (!(type in UNIT_DEFS)) return null;

  return { type, tier };
}

function normalizeMarchPayload(march: MarchPayload): ParsedUnit[] {
  const result: ParsedUnit[] = [];

  for (const [code, value] of Object.entries(march)) {
    const count = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(count) || count <= 0) continue;

    const parsed = parseUnitCode(code);
    if (!parsed) continue;

    result.push({
      type: parsed.type,
      tier: parsed.tier,
      count,
    });
  }

  return result;
}

function findEnemyWall(marchO: ParsedUnit[]): EnemyWall {
  const infantryTiers = marchO
    .filter((u) => u.type === "Infantry" && u.count > 0)
    .map((u) => u.tier);

  if (infantryTiers.length > 0) {
    const rMax = Math.max(...infantryTiers);
    const unitDef = UNIT_DEFS.Infantry[rMax];
    return {
      type: "Infantry",
      tier: rMax,
      subtype: unitDef.subtype,
    };
  }

  const vehicleTiers = marchO
    .filter((u) => u.type === "Vehicles" && u.count > 0)
    .map((u) => u.tier);

  if (vehicleTiers.length > 0) {
    const rMax = Math.max(...vehicleTiers);
    const unitDef = UNIT_DEFS.Vehicles[rMax];
    return {
      type: "Vehicles",
      tier: rMax,
      subtype: unitDef.subtype,
    };
  }

  const distanceTiers = marchO
    .filter((u) => u.type === "Distance" && u.count > 0)
    .map((u) => u.tier);

  if (distanceTiers.length > 0) {
    const rMax = Math.max(...distanceTiers);
    const unitDef = UNIT_DEFS.Distance[rMax];
    return {
      type: "Distance",
      tier: rMax,
      subtype: unitDef.subtype,
    };
  }

  return { type: null, tier: null, subtype: null };
}

function counterMultiplier(unitType: UnitType, subtype: string, enemyWall: EnemyWall): number {
  if (enemyWall.type !== "Infantry" || !enemyWall.subtype) {
    return 1.0;
  }

  const wallSubtype = enemyWall.subtype;

  if (unitType === "Infantry") {
    return 1.0;
  }

  if (unitType === "Vehicles") {
    if (subtype === "Tank") {
      if (wallSubtype === "Machine Gunner") {
        return 1.4;
      }
      return 1.0;
    }

    if (subtype === "Jeep") {
      if (wallSubtype === "Machine Gunner") {
        return 0.6;
      }
      return 1.1;
    }
  }

  if (unitType === "Distance") {
    if (subtype === "Launcher") {
      if (wallSubtype === "Submachine Gunner") {
        return 0.5;
      }
      return 1.2;
    }

    if (subtype === "Sniper") {
      if (wallSubtype === "Machine Gunner") {
        return 1.3;
      }
      return 1.0;
    }
  }

  if (unitType === "Battery") {
    return 1.0;
  }

  return 1.0;
}

function computeSideScore(marchS: ParsedUnit[], marchO: ParsedUnit[]): number {
  const capS = marchS.reduce((sum, u) => sum + u.count, 0);
  const capO = marchO.reduce((sum, u) => sum + u.count, 0);

  const enemyWall = findEnemyWall(marchO);

  let baseScore = 0;
  const nType: Record<UnitType, number> = {
    Infantry: 0,
    Vehicles: 0,
    Distance: 0,
    Battery: 0,
  };

  let nSubmachineFront = 0;
  let hasTanks = false;
  let hasJeeps = false;

  for (const unit of marchS) {
    const { type, tier, count } = unit;
    if (count <= 0) continue;

    const unitDef = UNIT_DEFS[type]?.[tier];
    if (!unitDef) continue;

    const { subtype, P_base } = unitDef;

    const eps = count * P_base;
    const m = counterMultiplier(type, subtype, enemyWall);
    baseScore += eps * m;

    nType[type] += count;

    if (type === "Infantry" && subtype === "Submachine Gunner") {
      nSubmachineFront += count;
    }

    if (type === "Vehicles") {
      if (subtype === "Tank") {
        hasTanks = true;
      } else if (subtype === "Jeep") {
        hasJeeps = true;
      }
    }
  }

  let synergy = 1.0;
  if (hasTanks && hasJeeps) {
    synergy = SYNERGY_BONUS;
  } else if (hasTanks && !hasJeeps) {
    synergy = SYNERGY_MALUS;
  }

  let mono = 1.0;
  if (capS > 0) {
    const shares = (Object.keys(nType) as UnitType[]).map((t) => nType[t] / capS);
    const maxShare = Math.max(...shares);
    if (maxShare > MONO_THRESHOLD) {
      mono = MONO_MALUS;
    }
  }

  const nDistanceEnemy = marchO
    .filter((u) => u.type === "Distance")
    .reduce((sum, u) => sum + u.count, 0);

  const distEnemyShare = capO > 0 ? nDistanceEnemy / capO : 0;

  const frontSubmachineShare = capS > 0 ? nSubmachineFront / capS : 0;
  const frontEff = Math.min(frontSubmachineShare, 0.3);

  let frontShield = 1.0;
  if (frontEff > 0.2) {
    frontShield = 1.0 + K_FRONT * (frontEff - 0.2) * distEnemyShare;
  }

  return baseScore * synergy * mono * frontShield;
}

export function evaluateBattle(
  myMarch: MarchPayload,
  enemyMarch: MarchPayload
): BattleResult {
  const marchYou = normalizeMarchPayload(myMarch);
  const marchEnemy = normalizeMarchPayload(enemyMarch);

  const scoreYou = computeSideScore(marchYou, marchEnemy);
  const scoreEnemy = computeSideScore(marchEnemy, marchYou);

  let winIndex: number;
  let winProbability: number;

  if (scoreEnemy <= 0) {
    winIndex = Number.POSITIVE_INFINITY;
    winProbability = 1.0;
  } else {
    winIndex = scoreYou / scoreEnemy;
    const winIndexPow = Math.pow(winIndex, LOGISTIC_ALPHA);
    winProbability = winIndexPow / (1 + winIndexPow);
  }

  return {
    scoreYou,
    scoreEnemy,
    winProbability,
    details: {
      engineVersion: ENGINE_VERSION,
      winIndex,
      logisticAlpha: LOGISTIC_ALPHA,
      kFront: K_FRONT,
      synergyBonus: SYNERGY_BONUS,
      synergyMalus: SYNERGY_MALUS,
      monoThreshold: MONO_THRESHOLD,
      monoMalus: MONO_MALUS,
    },
  };
}
