// lib/engine/constants.ts

// Version der March-Scientist-Engine
export const ENGINE_VERSION = "6.4" as const;

// Parameter der v6.4-Formel (tuning)
export const K_FRONT = 5;          // k_front Parameter für FrontShield-Berechnung
export const SYNERGY_BONUS = 1.10; // Bonus, wenn Tanks + Jeeps vorhanden
export const SYNERGY_MALUS = 0.90; // leichter Malus für reine Tanks (tuned, damit Tanks vs MG > 0.5)
export const MONO_THRESHOLD = 0.80; // Schwellenwert 80% für Mono-Penalty
export const MONO_MALUS = 0.70;     // Malus, wenn >80% gleicher Typ
