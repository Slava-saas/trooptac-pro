// app/dashboard/calculator/actions.ts
import { evaluateBattle } from "@/lib/engine/core";
import { ENGINE_VERSION } from "@/lib/engine/constants";
import { recommendMarch } from "@/lib/engine/recommend";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type MarchPayload = Record<string, number>;

function isEnemyMarchKey(key: string): boolean {
  return (
    key.startsWith("march.Infantry_enemy_") ||
    key.startsWith("march.Vehicles_enemy_") ||
    key.startsWith("march.Distance_enemy_") ||
    key.startsWith("march.Battery_enemy_")
  );
}

function parseEnemyMarch(entries: Record<string, unknown>): MarchPayload {
  const enemy: MarchPayload = {};

  for (const [key, val] of Object.entries(entries)) {
    const numVal = Number(val) || 0;

    if (isEnemyMarchKey(key)) {
      const unitKey = key
        .replace("march.", "") // Infantry_enemy_1
        .replace("_enemy", ""); // Infantry_1
      enemy[unitKey] = numVal;
    }
  }

  return enemy;
}

export async function calculateBattleAction(formData: FormData) {
  "use server";

  const capRaw = formData.get("capYou");
  const capYou = Number(capRaw) || 0;

  const data = Object.fromEntries(formData.entries());
  const enemyMarch = parseEnemyMarch(data);

  const { recommendedMarch, result } = recommendMarch(capYou, enemyMarch);

  return {
    ...result,
    recommendedMarch,
  };
}

export async function savePlanAction(formData: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const capRaw = formData.get("capYou");
  const capYou = Number(capRaw) || 0;

  if (!Number.isFinite(capYou) || capYou <= 0) {
    throw new Error("Enter your march capacity to save a profile.");
  }

  const nameRaw = formData.get("profileName") ?? formData.get("planName");
  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : "Untitled";

  const data = Object.fromEntries(formData.entries());
  const enemyMarch = parseEnemyMarch(data);

  // Save = speichert Szenario (cap + enemy) + Ergebnis des Recommended March
  const { recommendedMarch, result } = recommendMarch(capYou, enemyMarch);

  const userSettings = await prisma.userSettings.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  const countProfiles = await prisma.marchPlan.count({
    where: { userId },
  });

  if (!userSettings.isPro && countProfiles >= 5) {
    throw new Error("Free profile limit reached. Upgrade to Pro for unlimited saves.");
  }

  const saved = await prisma.marchPlan.create({
    data: {
      userId,
      name,
      myMarchPayload: { capYou, recommendedMarch }, // bewusst: kein "your march" Input mehr
      enemyMarchPayload: enemyMarch,
      resultScore: result.scoreYou,
      resultWinProb: result.winProbability,
      engineVersion: ENGINE_VERSION,
    },
  });

  return saved.id;
}

export async function listProfilesAction() {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const profiles = await prisma.marchPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true, resultWinProb: true },
    take: 50,
  });

  return profiles;
}

export async function loadProfileAction(profileId: string) {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const p = await prisma.marchPlan.findFirst({
    where: { id: profileId, userId },
    select: { id: true, name: true, myMarchPayload: true, enemyMarchPayload: true },
  });

  if (!p) throw new Error("Profile not found.");

  const mp = p.myMarchPayload as any;

  let capYou = Number(mp?.capYou) || 0;
  if (!capYou || capYou <= 0) {
    // Backward-compatible: older saves stored a full march payload (sum = capacity)
    capYou = (Object.values(mp ?? {}) as unknown[]).reduce<number>((sum, v) => sum + (Number(v) || 0), 0);
  }
return {
    id: p.id,
    name: p.name,
    capYou,
    enemyMarchPayload: (p.enemyMarchPayload ?? {}) as Record<string, number>,
  };
}


