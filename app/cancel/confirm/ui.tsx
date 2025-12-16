// app/cancel/confirm/ui.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CancelConfirmClient() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!token) {
        setState("err");
        return;
      }

      try {
        setState("loading");
        const res = await fetch("/api/cancel/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) throw new Error("CONFIRM_FAILED");
        if (!cancelled) setState("ok");
      } catch {
        if (!cancelled) setState("err");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state === "loading" || state === "idle") {
    return (
      <div className="border border-slate-800 rounded p-4 max-w-lg">
        <p className="text-sm">Bestätigung wird verarbeitet…</p>
      </div>
    );
  }

  if (state === "ok") {
    return (
      <div className="border border-slate-800 rounded p-4 max-w-lg">
        <p className="text-sm">
          Danke! Wenn zu dieser E-Mail ein aktives Abo existiert, wurde die Kündigung zum Ende des aktuellen Abrechnungszeitraums gesetzt.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-800 rounded p-4 max-w-lg">
      <p className="text-sm">Ungültiger oder abgelaufener Bestätigungslink.</p>
    </div>
  );
}
