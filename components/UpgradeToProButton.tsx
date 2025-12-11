// components/UpgradeToProButton.tsx
"use client";

import { useState } from "react";

export function UpgradeToProButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      if (!res.ok) {
        setError("Upgrade failed. Please try again.");
        return;
      }

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError(data.error ?? "Missing checkout URL.");
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className="rounded bg-sky-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Upgrade to Pro"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
