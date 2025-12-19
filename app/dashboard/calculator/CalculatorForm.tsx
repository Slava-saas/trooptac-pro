"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PieChart, Pie } from "recharts";
import { TroopInputSection, type MarchFormValues } from "@/components/TroopInputSection";
import type { BattleResult } from "@/lib/engine/types";
import type { ProfileListItem, ProfilePayload } from "./actions";

type Props = {
  calculateBattle: (formData: FormData) => Promise<BattleResult>;
  savePlan: (formData: FormData) => Promise<string>;
  listProfiles: () => Promise<ProfileListItem[]>;
  loadProfile: (profileId: string) => Promise<ProfilePayload>;
};

type EngineDetails = {
  engineVersion?: string;
  winIndex?: number;
  [key: string]: unknown;
};

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function enemyKeyFromBase(baseKey: string): string {
  // "Infantry_1" -> "Infantry_enemy_1"
  return baseKey.replace("_", "_enemy_");
}

export function CalculatorForm({ calculateBattle, savePlan, listProfiles, loadProfile }: Props) {
  const [result, setResult] = useState<BattleResult | null>(null);
  const [isCalculating, startCalcTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();

  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [isLoadingProfiles, startProfilesTransition] = useTransition();

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const form = useForm<MarchFormValues>({
    defaultValues: {
      planName: "",
      march: {},
      enemy: {},
    },
  });

  const { handleSubmit, reset, register, getValues } = form;

  const refreshProfiles = () => {
    startProfilesTransition(async () => {
      try {
        const list = await listProfiles();
        setProfiles(list);
        if (!selectedProfileId && list.length > 0) setSelectedProfileId(list[0].id);
      } catch {
        // ignore
      }
    });
  };

  useEffect(() => {
    refreshProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildFormData = (values: MarchFormValues): FormData => {
    const formData = new FormData();

    if (values.planName) {
      formData.append("planName", values.planName);
    }

    for (const [key, value] of Object.entries(values.march ?? {})) {
      const num = Number(value ?? 0) || 0;
      formData.append(`march.${key}`, String(num));
    }

    return formData;
  };

  const onSubmit = (values: MarchFormValues) => {
    const formData = buildFormData(values);

    startCalcTransition(async () => {
      const res = await calculateBattle(formData);
      setResult(res);
      setSaveMessage(null);
      setSaveError(null);
    });
  };

  const handleReset = () => {
    reset({ planName: "", march: {}, enemy: {} });
    setResult(null);
    setSaveMessage(null);
    setSaveError(null);
  };

  const handleSaveProfile = () => {
    const values = getValues();
    const formData = buildFormData(values);

    setSaveMessage(null);
    setSaveError(null);

    startSaveTransition(async () => {
      try {
        const id = await savePlan(formData);
        setSaveMessage("Profile saved.");
        setSelectedProfileId(id);

        // refresh list so it becomes selectable immediately
        const list = await listProfiles();
        setProfiles(list);
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to save profile.";
        setSaveError(msg);
      }
    });
  };

  const handleUseProfile = () => {
    if (!selectedProfileId) return;

    setSaveMessage(null);
    setSaveError(null);

    startProfilesTransition(async () => {
      try {
        const p = await loadProfile(selectedProfileId);

        const march: Record<string, number> = {};

        for (const [k, v] of Object.entries(p.myMarchPayload ?? {})) {
          march[k] = toNumber(v);
        }
        for (const [k, v] of Object.entries(p.enemyMarchPayload ?? {})) {
          march[enemyKeyFromBase(k)] = toNumber(v);
        }

        reset({ planName: p.name ?? "", march, enemy: {} });
        setResult(null);
        setSaveMessage("Profile applied.");
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : "Failed to load profile.";
        setSaveError(msg);
      }
    });
  };

  const winPerc =
    result && Number.isFinite(result.winProbability)
      ? Math.round(result.winProbability * 100)
      : 0;

  const pieData =
    result !== null
      ? [
          { name: "Win", value: winPerc },
          { name: "Lose", value: 100 - winPerc },
        ]
      : [];

  const details: EngineDetails | null = result ? (result.details as EngineDetails) : null;

  const disableSave = isCalculating || isSaving || isLoadingProfiles;

  return (
    <div>
      {/* Profile panel */}
      <div className="mb-6 grid gap-2 rounded border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Profile</h2>
          <span className="text-xs text-slate-400">
            {profiles.length} saved
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-sm text-slate-100"
          >
            <option value="">Select profile…</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || "Untitled"}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleUseProfile}
            disabled={!selectedProfileId || isLoadingProfiles}
            className="rounded bg-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-600 disabled:opacity-60"
          >
            {isLoadingProfiles ? "Loading…" : "Use Profile"}
          </button>
        </div>

        {profiles.length === 0 ? (
          <p className="text-xs text-slate-400">
            No profiles saved yet. Use “Save Profile” below.
          </p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm" htmlFor="planName">
            Profile name
          </label>
          <input
            id="planName"
            type="text"
            {...register("planName")}
            className="w-full max-w-xs rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-slate-100"
            placeholder="Optional profile name"
          />
        </div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* My March */}
          <div className="flex-1">
            <h2 className="mb-4 text-xl font-bold">My March</h2>
            <TroopInputSection title="Infantry" typeKey="Infantry" form={form} />
            <TroopInputSection title="Vehicles" typeKey="Vehicles" form={form} />
            <TroopInputSection title="Distance" typeKey="Distance" form={form} />
            <TroopInputSection title="Battery" typeKey="Battery" form={form} />
          </div>

          {/* Enemy March */}
          <div className="flex-1">
            <h2 className="mb-4 text-xl font-bold">Enemy March</h2>
            <TroopInputSection title="Infantry" typeKey="Infantry_enemy" form={form} />
            <TroopInputSection title="Vehicles" typeKey="Vehicles_enemy" form={form} />
            <TroopInputSection title="Distance" typeKey="Distance_enemy" form={form} />
            <TroopInputSection title="Battery" typeKey="Battery_enemy" form={form} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isCalculating}
            className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
          >
            {isCalculating ? "Calculating..." : "Calculate"}
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={disableSave}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Reset
          </button>
        </div>

        {saveMessage && <p className="mt-2 text-xs text-emerald-400">{saveMessage}</p>}
        {saveError && <p className="mt-2 text-xs text-red-400">{saveError}</p>}
      </form>

      {result && (
        <div className="mt-6 grid gap-4 rounded border border-slate-800 bg-slate-900 p-4 text-sm md:grid-cols-[auto,1fr] md:items-center">
          <div className="flex flex-col items-center">
            <h2 className="mb-2 text-base font-semibold">
              Win Probability: {winPerc}%
            </h2>
            <PieChart width={220} height={120}>
              <Pie
                startAngle={180}
                endAngle={0}
                data={pieData}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
              />
            </PieChart>
          </div>

          <div className="space-y-1">
            <p>
              Score You: <span className="font-mono">{result.scoreYou.toFixed(2)}</span>
            </p>
            <p>
              Score Enemy: <span className="font-mono">{result.scoreEnemy.toFixed(2)}</span>
            </p>
            {details && (
              <>
                <p>
                  Engine: <span className="font-mono">{details.engineVersion ?? "n/a"}</span>
                </p>
                <p>
                  WinIndex:{" "}
                  <span className="font-mono">
                    {typeof details.winIndex === "number" ? details.winIndex.toFixed(3) : "n/a"}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
