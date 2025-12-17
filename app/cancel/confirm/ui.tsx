// app/cancel/confirm/ui.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <Alert>
        <AlertDescription>Processing confirmation…</AlertDescription>
      </Alert>
    );
  }

  if (state === "ok") {
    return (
      <Alert>
        <AlertDescription>
          Thanks! If an active subscription exists for this email, cancellation was scheduled for the end of the current billing period.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertDescription>Invalid or expired confirmation link.</AlertDescription>
    </Alert>
  );
}
