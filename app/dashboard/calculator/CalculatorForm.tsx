"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PieChart, Pie } from "recharts";
import { TroopInputSection, type MarchFormValues } from "@/components/TroopInputSection";
import type { BattleResult } from "@/lib/engine/types";

type RecommendResult = BattleResult & { recommendedMarch: Record<string, number> };

type ProfileListItem = {
  id: string;
  name: string;
  createdAt: string | Date;
  resultWinProb: number;
};

type LoadedProfile = {
  id: string;
  name: string;
  capYou: number;
  enemyMarchPayload: Record<string, number>;
};

type Props = {
  calculateBattle: (formData: FormData) => Promise<RecommendResult>;
  savePlan: (formData: FormData) => Promise<string>;
  listProfiles: () => Promise<ProfileListItem[]>;
  loadProfile: (profileId: string) => Promise<LoadedProfile>;
};

const TIERS = [1,2,3,4,5,6,7,8,9,10,11,12] as const;
const TYPES = ["Infantry", "Vehicles", "Distance", "Battery"] as const;

function buildZeroEnemyMarch(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const t of TYPES) {
    for (const tier of TIERS) {
      m[`${t}_enemy_${tier}`] = 0;
    }
  }
  return m;
}

const DEFAULT_MARCH = buildZeroEnemyMarch();

const DEFAULTS: MarchFormValues = {
  planName: "",
  march: DEFAULT_MARCH,
  enemy: {},
};

function enemyFormKey(unitKey: string): string {
  // "Infantry_1" -> "Infantry_enemy_1"
  return unitKey.replace(/^([A-Za-z]+)_/, "$1_enemy_");
}

function groupByType(march: Record<string, number>) {
  const out: Record<string, Array<{ tier: number; n: number }>> = {};
  for (const [k, v] of Object.entries(march)) {
    if (!v) continue;
    const m = k.match(/^([A-Za-z]+)_(\d+)$/);
    if (!m) continue;
    const type = m[1];
    const tier = Number(m[2]) || 0;
    out[type] = out[type] ?? [];
    out[type].push({ tier, n: v });
  }
  for (const t of Object.keys(out)) out[t].sort((a, b) => b.tier - a.tier);
  return out;
}

export function CalculatorForm({
  calculateBattle,
  savePlan,
  listProfiles,
  loadProfile,
}: Props) {
  const [capYou, setCapYou] = useState<number>(0);

  const [result, setResult] = useState<RecommendResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const [isCalculating, startCalcTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  const [overwriteCandidate, setOverwriteCandidate] = useState<string | null>(null);

  const form = useForm<MarchFormValues>({
    defaultValues: DEFAULTS,
  });

  const { handleSubmit, reset, register, getValues, watch } = form;

  const nameValue = (watch("planName") ?? "").trim();
  const nameOk = nameValue.length > 0;

  useEffect(() => {
    if (overwriteCandidate && nameValue !== overwriteCandidate) {
      setOverwriteCandidate(null);
    }
  }, [nameValue, overwriteCandidate]);

  const refreshProfiles = async () => {
    const p = await listProfiles();
    setProfiles(p);
    if (!selectedProfileId && p.length > 0) setSelectedProfileId(p[0]!.id);
  };

  useEffect(() => {
    refreshProfiles().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildFormData = (values: MarchFormValues, opts?: { overwrite?: boolean }): FormData => {
    const fd = new FormData();

    fd.append("capYou", String(Number(capYou) || 0));

    if (values.planName) {
      fd.append("profileName", values.planName);
    }

    if (opts?.overwrite) {
      fd.append("overwrite", "true");
    }

    for (const [key, value] of Object.entries(values.march ?? {})) {
      const num = Number(value ?? 0) || 0;
      fd.append(`march.${key}`, String(num));
    }

    return fd;
  };

  const onSubmit = (values: MarchFormValues) => {
    const fd = buildFormData(values);

    setCalcError(null);
    setSaveMessage(null);
    setSaveError(null);

    startCalcTransition(async () => {
      try {
        const res = await calculateBattle(fd);
        setResult(res);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to calculate.";
        setCalcError(msg);
        setResult(null);
      }
    });
  };

  const doSave = (opts?: { overwrite?: boolean }) => {
    const values = getValues();

    const name = (values.planName ?? "").trim();
    if (!name) {
      setSaveError("Profile name is required.");
      setSaveMessage(null);
      setOverwriteCandidate(null);
      return;
    }

    const fd = buildFormData(values, opts);

    setSaveMessage(null);
    setSaveError(null);

    startSaveTransition(async () => {
      try {
        const id = await savePlan(fd);
        setSaveMessage(`Profile saved (ID: ${id})`);
        setOverwriteCandidate(null);
        await refreshProfiles();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to save profile.";

        if (msg.includes("PROFILE_NAME_REQUIRED")) {
          setSaveError("Profile name is required.");
          return;
        }

        if (msg.includes("PROFILE_NAME_EXISTS")) {
          setOverwriteCandidate(name);
          setSaveError(null);
          setSaveMessage(null);
          return;
        }

        setSaveError(msg);
      }
    });
  };

  const handleApplyProfile = () => {
    if (!selectedProfileId) return;

    startCalcTransition(async () => {
      try {
        const p = await loadProfile(selectedProfileId);

        const enemyMarchAsFormKeys: Record<string, number> = {};
        for (const [unitKey, n] of Object.entries(p.enemyMarchPayload ?? {})) {
          enemyMarchAsFormKeys[enemyFormKey(unitKey)] = Number(n) || 0;
        }

        setCapYou(Number(p.capYou) || 0);

        const merged = { ...DEFAULT_MARCH, ...enemyMarchAsFormKeys };

        reset({ planName: p.name, march: merged, enemy: {} });

        setResult(null);
        setCalcError(null);
        setSaveMessage(null);
        setSaveError(null);
        setOverwriteCandidate(null);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load profile.";
        setCalcError(msg);
        setResult(null);
      }
    });
  };

  const handleReset = () => {
    setCapYou(0);
    reset(DEFAULTS);
    setResult(null);
    setCalcError(null);
    setSaveMessage(null);
    setSaveError(null);
    setOverwriteCandidate(null);
  };

  const winPerc =
    result && Number.isFinite(result.winProbability)
      ? Math.round(result.winProbability * 100)
      : 0;

  const pieData =
    result
      ? [
          { name: "Win", value: winPerc },
          { name: "Lose", value: 100 - winPerc },
        ]
      : [];

  const recommendedGrouped = useMemo(
    () => (result?.recommendedMarch ? groupByType(result.recommendedMarch) : null),
    [result]
  );

  const disableActions = isCalculating || isSaving;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="grid gap-3 rounded border border-slate-800 bg-slate-900 p-4 md:grid-cols-3">
        <div className="space-y-2">
          <div className="text-sm font-medium">Profile</div>
          <div className="flex gap-2">
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-100"
            >
              {profiles.length === 0 ? (
                <option value="">No profiles saved yet</option>
              ) : (
                profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              onClick={handleApplyProfile}
              disabled={disableActions || !selectedProfileId}
              className="rounded bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:opacity-60"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="profileName">
            Profile name
          </label>
          <input
            id="profileName"
            type="text"
            {...register("planName")}
            className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-100"
            placeholder="Required"
            onFocus={() => setOverwriteCandidate(null)}
          />
          <div className="text-xs text-slate-400">
            Required to save.
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="capYou">
            Your march capacity
          </label>
          <input
            id="capYou"
            inputMode="numeric"
            pattern="[0-9]*"
            value={capYou ? String(capYou) : ""}
            onChange={(e) => setCapYou(Number(e.target.value) || 0)}
            className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-100"
            placeholder="e.g. 300000"
          />
        </div>
      </div>

      {/* Overwrite confirm */}
      {overwriteCandidate ? (
        <div className="rounded border border-slate-800 bg-slate-900 p-4 text-sm">
          <div className="font-medium">
            A profile named “{overwriteCandidate}” already exists.
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disableActions}
              onClick={() => doSave({ overwrite: true })}
              className="rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60"
            >
              Replace
            </button>
            <button
              type="button"
              disabled={disableActions}
              onClick={() => setOverwriteCandidate(null)}
              className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
            >
              No
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            If you click “No”, choose a different profile name.
          </div>
        </div>
      ) : null}

      {/* Enemy input + Actions */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-3 text-base font-semibold">Enemy formation</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <TroopInputSection title="Infantry" typeKey="Infantry_enemy" form={form} />
            <TroopInputSection title="Vehicles" typeKey="Vehicles_enemy" form={form} />
            <TroopInputSection title="Distance" typeKey="Distance_enemy" form={form} />
            <TroopInputSection title="Battery" typeKey="Battery_enemy" form={form} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isCalculating}
            className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {isCalculating ? "Calculating..." : "Calculate"}
          </button>

          <button
            type="button"
            onClick={() => doSave()}
            disabled={disableActions || !nameOk}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>

        {calcError && <p className="text-xs text-red-400">{calcError}</p>}
        {saveMessage && <p className="text-xs text-emerald-400">{saveMessage}</p>}
        {saveError && <p className="text-xs text-red-400">{saveError}</p>}
        {!nameOk && <p className="text-xs text-amber-400">Profile name is required to save.</p>}
      </form>

      {/* Output */}
      {result && (
        <div className="grid gap-4 rounded border border-slate-800 bg-slate-900 p-4 md:grid-cols-[260px,1fr] md:items-start">
          <div className="flex flex-col items-center">
            <h2 className="mb-2 text-base font-semibold">Win Probability: {winPerc}%</h2>
            <PieChart width={240} height={130}>
              <Pie
                startAngle={180}
                endAngle={0}
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={85}
              />
            </PieChart>

            <div className="mt-2 text-sm">
              <div>
                Score You: <span className="font-mono">{result.scoreYou.toFixed(2)}</span>
              </div>
              <div>
                Score Enemy: <span className="font-mono">{result.scoreEnemy.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Recommended formation</div>

            {recommendedGrouped ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Object.entries(recommendedGrouped).map(([type, rows]) => (
                  <div key={type} className="rounded border border-slate-800 bg-slate-950 p-3">
                    <div className="text-sm font-medium">{type}</div>
                    <div className="mt-2 space-y-1 text-xs text-slate-200">
                      {rows.map((r) => (
                        <div key={`${type}-${r.tier}`} className="flex items-center justify-between">
                          <span className="text-slate-400">Tier {r.tier}</span>
                          <span className="font-mono">{r.n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
