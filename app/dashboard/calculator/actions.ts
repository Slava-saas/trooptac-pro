// app/dashboard/calculator/actions.ts
import { evaluateBattle } from "@/lib/engine/core";
import { ENGINE_VERSION } from "@/lib/engine/constants";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

function isMyMarchKey(key: string): boolean {
  return (
    key.startsWith("march.Infantry_") ||
    key.startsWith("march.Vehicles_") ||
    key.startsWith("march.Distance_") ||
    key.startsWith("march.Battery_")
  );
}

function isEnemyMarchKey(key: string): boolean {
  return (
    key.startsWith("march.Infantry_enemy_") ||
    key.startsWith("march.Vehicles_enemy_") ||
    key.startsWith("march.Distance_enemy_") ||
    key.startsWith("march.Battery_enemy_")
  );
}

export async function calculateBattleAction(formData: FormData) {
  "use server";

  const data = Object.fromEntries(formData.entries());

  const myMarch: Record<string, number> = {};
  const enemyMarch: Record<string, number> = {};

  for (const [key, val] of Object.entries(data)) {
    const numVal = Number(val) || 0;

    // 1) Enemy-March zuerst
    if (isEnemyMarchKey(key)) {
      const unitKey = key
        .replace("march.", "") // Infantry_enemy_1
        .replace("_enemy", ""); // Infantry_1

      enemyMarch[unitKey] = numVal;
      continue;
    }

    // 2) My March
    if (isMyMarchKey(key) && !key.includes("_enemy")) {
      const unitKey = key.replace("march.", ""); // Infantry_1
      myMarch[unitKey] = numVal;
      continue;
    }
  }

  const result = evaluateBattle(myMarch, enemyMarch);

  return result;
}

export async function savePlanAction(formData: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const nameRaw = formData.get("planName");
  const name =
    (typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : "Untitled");

  const data = Object.fromEntries(formData.entries());

  const myMarch: Record<string, number> = {};
  const enemyMarch: Record<string, number> = {};

  for (const [key, val] of Object.entries(data)) {
    if (key === "planName") continue;

    const numVal = Number(val) || 0;

    // 1) Enemy-March zuerst
    if (isEnemyMarchKey(key)) {
      const unitKey = key
        .replace("march.", "")
        .replace("_enemy", "");

      enemyMarch[unitKey] = numVal;
      continue;
    }

    // 2) My March
    if (isMyMarchKey(key) && !key.includes("_enemy")) {
      const unitKey = key.replace("march.", "");
      myMarch[unitKey] = numVal;
      continue;
    }
  }

  const result = evaluateBattle(myMarch, enemyMarch);

  const userSettings = await prisma.userSettings.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  const countPlans = await prisma.marchPlan.count({
    where: { userId },
  });

  if (!userSettings.isPro && countPlans >= 5) {
    throw new Error(
      "Free profile limit reached. Upgrade to Pro for unlimited saves.",
    );
  }

  const saved = await prisma.marchPlan.create({
    data: {
      userId,
      name,
      myMarchPayload: myMarch,
      enemyMarchPayload: enemyMarch,
      resultScore: result.scoreYou,
      resultWinProb: result.winProbability,
      engineVersion: ENGINE_VERSION,
    },
  });

  return saved.id;
}

export type ProfileListItem = {
  id: string;
  name: string;
  createdAt: string;
};

export type ProfilePayload = {
  id: string;
  name: string;
  myMarchPayload: Record<string, number>;
  enemyMarchPayload: Record<string, number>;
};

export async function listProfilesAction(): Promise<ProfileListItem[]> {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const plans = await prisma.marchPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });

  return plans.map((p) => ({
    id: p.id,
    name: p.name,
    createdAt: p.createdAt.toISOString(),
  }));
}

export async function loadProfileAction(profileId: string): Promise<ProfilePayload> {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const plan = await prisma.marchPlan.findFirst({
    where: { id: profileId, userId },
    select: { id: true, name: true, myMarchPayload: true, enemyMarchPayload: true },
  });

  if (!plan) throw new Error("Profile not found.");

  return {
    id: plan.id,
    name: plan.name,
    myMarchPayload: (plan.myMarchPayload ?? {}) as Record<string, number>,
    enemyMarchPayload: (plan.enemyMarchPayload ?? {}) as Record<string, number>,
  };
}

