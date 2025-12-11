// app/dashboard/settings/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    return <p>Unauthorized</p>;
  }

  const user = await prisma.userSettings.findUnique({
    where: { id: userId },
  });

  const isPro = user?.isPro ?? false;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Settings</h1>

      <div className="mb-4 text-sm">
        <span>Status: </span>
        {isPro ? (
          <span className="font-semibold text-emerald-400">PRO User</span>
        ) : (
          <span className="text-slate-400">Free User</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          disabled
          className="rounded bg-sky-700/60 px-4 py-2 text-white opacity-60"
        >
          Upgrade to Pro (coming soon)
        </button>

        {isPro && (
          <button
            type="button"
            disabled
            className="rounded bg-slate-700 px-4 py-2 text-white opacity-60"
          >
            Manage Subscription (coming soon)
          </button>
        )}
      </div>
    </div>
  );
}
