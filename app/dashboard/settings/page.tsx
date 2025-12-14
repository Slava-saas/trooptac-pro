// app/dashboard/settings/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { UpgradeToProButton } from "@/components/UpgradeToProButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

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

      <div className="mb-4 text-xs text-slate-400">
        {!isPro
          ? "Upgrade to Pro to unlock full features."
          : "You currently have an active Pro subscription."}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {!isPro ? (
          <UpgradeToProButton />
        ) : (
          <ManageSubscriptionButton />
        )}
      </div>
    </div>
  );
}

