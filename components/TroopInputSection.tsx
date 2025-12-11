// components/TroopInputSection.tsx
"use client";

import type { UseFormReturn } from "react-hook-form";

export interface MarchFormValues {
  planName: string;
  march: Record<string, number>;
  enemy: Record<string, number>;
}

type Props = {
  title: string;
  typeKey: string;
  form: UseFormReturn<MarchFormValues>;
};

export function TroopInputSection({ title, typeKey, form }: Props) {
  const { register } = form;

  return (
    <div className="mb-4">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(12)].map((_, i) => {
          const tier = i + 1;
          const fieldName = `${typeKey}_${tier}`; // z.B. Infantry_1
          return (
            <div key={fieldName} className="flex items-center gap-1">
              <label className="w-12 text-xs" htmlFor={fieldName}>
                T{tier}:
              </label>
              <input
                type="number"
                id={fieldName}
                {...register(`march.${fieldName}` as const, {
                  valueAsNumber: true,
                })}
                className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
                min={0}
                defaultValue={0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
