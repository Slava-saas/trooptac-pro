// app/cancel/ui.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      <Alert>
        <AlertDescription>
          If the email belongs to an active subscription, we sent you a confirmation link. Please check spam too.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="cancel-email">Email</Label>
        <Input
          id="cancel-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
        />
      </div>

      <Button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Request confirmation link"}
      </Button>

      {state === "err" ? (
        <Alert variant="destructive">
          <AlertDescription>Request failed. Please try again.</AlertDescription>
        </Alert>
      ) : (
        <p className="text-xs text-muted-foreground">
          You’ll receive a link to confirm. After confirmation, cancellation is processed.
        </p>
      )}
    </form>
  );
}
