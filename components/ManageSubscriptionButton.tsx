"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManage = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setError(data?.error ?? "Missing portal URL.");
    } catch {
      setError("Portal request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <Button type="button" variant="secondary" onClick={handleManage} disabled={loading}>
        {loading ? "Opening…" : "Manage subscription"}
      </Button>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
