"use client";

import { useState } from "react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManage = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setError(data?.error ?? "Missing portal URL.");
    } catch (e) {
      setError("Portal request failed.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleManage}
        disabled={loading}
        className="rounded bg-slate-700 px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Opening…" : "Manage Subscription"}
      </button>

      {error ? <div className="text-xs text-red-400">{error}</div> : null}
    </div>
  );
}
