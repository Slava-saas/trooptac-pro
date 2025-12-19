// app/dashboard/calculator/actions.ts
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

  const overwrite = formData.get("overwrite") === "true";

  const capRaw = formData.get("capYou");
  const capYou = Number(capRaw) || 0;
  if (!Number.isFinite(capYou) || capYou <= 0) {
    throw new Error("Enter your march capacity to save a profile.");
  }

  const nameRaw = formData.get("profileName") ?? formData.get("planName");
  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : "";

  if (!name) {
    throw new Error("PROFILE_NAME_REQUIRED");
  }

  const data = Object.fromEntries(formData.entries());
  const enemyMarch = parseEnemyMarch(data);

  // Save = stores scenario (cap + enemy) + recommended output
  const { recommendedMarch, result } = recommendMarch(capYou, enemyMarch);

  const userSettings = await prisma.userSettings.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  // Duplicate-name policy:
  // - if exists and overwrite=false -> error
  // - if overwrite=true -> update newest, delete other duplicates
  const duplicates = await prisma.marchPlan.findMany({
    where: { userId, name },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (duplicates.length > 0 && !overwrite) {
    throw new Error("PROFILE_NAME_EXISTS");
  }

  // Free limit only applies to creating a NEW name
  if (duplicates.length === 0) {
    const countProfiles = await prisma.marchPlan.count({ where: { userId } });

    if (!userSettings.isPro && countProfiles >= 5) {
      throw new Error("Free profile limit reached. Upgrade to Pro for unlimited saves.");
    }
  }

  const payloadMy = { capYou, recommendedMarch };

  if (duplicates.length > 0 && overwrite) {
    const keepId = duplicates[0]!.id;

    if (duplicates.length > 1) {
      await prisma.marchPlan.deleteMany({
        where: { userId, name, id: { not: keepId } },
      });
    }

    const saved = await prisma.marchPlan.update({
      where: { id: keepId },
      data: {
        myMarchPayload: payloadMy,
        enemyMarchPayload: enemyMarch,
        resultScore: result.scoreYou,
        resultWinProb: result.winProbability,
        engineVersion: ENGINE_VERSION,
      },
    });

    return saved.id;
  }

  const created = await prisma.marchPlan.create({
    data: {
      userId,
      name,
      myMarchPayload: payloadMy,
      enemyMarchPayload: enemyMarch,
      resultScore: result.scoreYou,
      resultWinProb: result.winProbability,
      engineVersion: ENGINE_VERSION,
    },
  });

  return created.id;
}

export async function listProfilesAction() {
  "use server";

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return prisma.marchPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true, resultWinProb: true },
    take: 50,
  });
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
    const rec = mp?.recommendedMarch;
    if (rec && typeof rec === "object") {
      capYou = (Object.values(rec as Record<string, unknown>) as unknown[]).reduce<number>(
        (sum, v) => sum + (Number(v) || 0),
        0,
      );
    } else {
      capYou = (Object.values(mp ?? {}) as unknown[]).reduce<number>(
        (sum, v) => sum + (Number(v) || 0),
        0,
      );
    }
  }

  return {
    id: p.id,
    name: p.name,
    capYou,
    enemyMarchPayload: (p.enemyMarchPayload ?? {}) as Record<string, number>,
  };
}
