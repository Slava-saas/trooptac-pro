// app/cancel/ui.tsx
"use client";

import { useState } from "react";

export default function CancelRequestForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;

    try {
      setState("loading");
      const res = await fetch("/api/cancel/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("REQUEST_FAILED");
      setState("ok");
    } catch {
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="border border-slate-800 rounded p-4 max-w-lg">
        <p className="text-sm">
          Wenn die E-Mail-Adresse zu einem aktiven Abo gehört, haben wir dir einen Bestätigungslink gesendet.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Bitte prüfe auch deinen Spam-Ordner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-slate-800 rounded p-4 max-w-lg">
      <label className="block text-sm font-medium mb-2" htmlFor="cancel-email">
        E-Mail-Adresse
      </label>
      <input
        id="cancel-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        className="w-full rounded border border-slate-800 bg-transparent px-3 py-2 text-sm"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={state === "loading"}
        className="mt-3 rounded border border-slate-800 px-3 py-2 text-sm hover:bg-slate-900 disabled:opacity-50"
      >
        {state === "loading" ? "Sende..." : "Bestätigungslink anfordern"}
      </button>

      {state === "err" ? (
        <p className="mt-2 text-xs text-slate-400">
          Anfrage fehlgeschlagen. Bitte versuche es erneut.
        </p>
      ) : (
        <p className="mt-2 text-xs text-slate-400">
          Du erhältst einen Link zur Bestätigung. Danach wird die Kündigung verarbeitet.
        </p>
      )}
    </form>
  );
}
