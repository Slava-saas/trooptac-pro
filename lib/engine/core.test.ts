// lib/engine/core.test.ts
import { describe, it, expect } from "vitest";
import { evaluateBattle } from "./core";

describe("March Scientist Engine v6.4", () => {
  it("Tank vs Machine Gunner Wall yields >50% win probability", () => {
    const myMarch = { Vehicles_1: 100 };    // 100 Tanks T1
    const enemyMarch = { Infantry_1: 100 }; // 100 MG T1

    const result = evaluateBattle(myMarch, enemyMarch);

    expect(result.winProbability).toBeGreaterThan(0.5);
  });
});
