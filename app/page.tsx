import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TroopTac.pro",
  description: "March-Calculator for PvP players",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">TroopTac.pro</h1>
        <p className="text-sm text-slate-400">March-Calculator for PvP players</p>
        <div className="flex items-center justify-center gap-3 text-sm">
          <Link className="underline" href="/dashboard">Open Dashboard</Link>
          <Link className="underline" href="/sign-in">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
