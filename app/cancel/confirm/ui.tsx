// app/cancel/confirm/ui.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CancelConfirmClient() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";

  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");

  async function onConfirm() {
    if (!token || state === "loading") {
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
      setState("ok");
    } catch {
      setState("err");
    }
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Invalid or expired confirmation link.</AlertDescription>
      </Alert>
    );
  }

  if (state === "ok") {
    return (
      <Alert>
        <AlertDescription>
          Done. If an active subscription exists for this email, cancellation was scheduled for the end of the current billing period.
        </AlertDescription>
      </Alert>
    );
  }

  if (state === "err") {
    return (
      <Alert variant="destructive">
        <AlertDescription>Confirmation failed. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-3">
      <Alert>
        <AlertDescription>
          Click to finalize the cancellation request.
        </AlertDescription>
      </Alert>

      <Button onClick={onConfirm} disabled={state === "loading"}>
        {state === "loading" ? "Processing…" : "Jetzt kündigen"}
      </Button>
    </div>
  );
}
