// app/dashboard/history/page.tsx
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

type HistoryPlan = {
  id: string;
  name: string;
  engineVersion: string;
  createdAt: Date;
  resultWinProb: number;
};

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return <p>Unauthorized</p>;
  }

  const plans: HistoryPlan[] = await prisma.marchPlan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (plans.length === 0) {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold">History</h1>
        <p className="text-sm text-slate-400">No plans saved yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">History</h1>
      <ul className="space-y-2 text-sm">
        {plans.map((plan) => (
          <li
            key={plan.id}
            className="flex flex-col rounded border border-slate-800 bg-slate-900 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="font-medium">
                {plan.name}{" "}
                {plan.engineVersion !== "6.4" && (
                  <span className="text-xs text-slate-400">
                    (v{plan.engineVersion})
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Saved: {plan.createdAt.toISOString()}
              </div>
            </div>
            <div className="mt-1 text-xs sm:mt-0">
              Win Probability:{" "}
              <span className="font-mono">
                {Math.round(plan.resultWinProb * 100)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
