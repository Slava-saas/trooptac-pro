import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "TroopTac.pro",
  description: "March-Calculator for PvP players",
};

export default async function Home() {
  // Einfacher Read-Only-Check, ob die DB erreichbar ist
  const plansCount = await prisma.marchPlan.count();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold">TroopTac.pro</h1>
        <p className="text-sm text-slate-400">
          Next.js + Tailwind + Clerk + Prisma-Dev-DB sind verkabelt.
        </p>
        <p className="text-xs text-slate-500">
          MarchPläne in der Dev-DB: <span className="font-mono">{plansCount}</span>
        </p>
      </div>
    </main>
  );
}
