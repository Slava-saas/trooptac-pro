// app/cancel/confirm/page.tsx
import { Suspense } from "react";
import CancelConfirmClient from "./ui";

export default function CancelConfirmPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kündigung bestätigen</h1>

      <Suspense
        fallback={
          <div className="border border-slate-800 rounded p-4 max-w-lg">
            <p className="text-sm">Bestätigung wird verarbeitet…</p>
          </div>
        }
      >
        <CancelConfirmClient />
      </Suspense>
    </main>
  );
}
