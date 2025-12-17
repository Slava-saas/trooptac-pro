import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { UpgradeToProButton } from "@/components/UpgradeToProButton";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SearchParams = Record<string, string | string[] | undefined>;

function first(sp: SearchParams, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

function formatDate(d?: Date | null) {
  if (!d) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};

  const { userId } = await auth();
  if (!userId) return <div className="text-sm text-muted-foreground">Unauthorized</div>;

  const user = await prisma.userSettings.findUnique({ where: { id: userId } });
  const isPro = user?.isPro ?? false;

  const checkoutSuccess = first(sp, "checkoutSuccess") === "true";
  const checkoutCanceled = first(sp, "checkoutCanceled") === "true";

  const hasCustomer = Boolean(user?.stripeCustomerId);
  const cancelScheduled = Boolean(user?.stripeCancelAtPeriodEnd);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your plan and subscription.
          </p>
        </div>

        <Badge variant={isPro ? "default" : "secondary"}>
          {isPro ? "PRO" : "FREE"}
        </Badge>
      </div>

      {checkoutSuccess ? (
        <Alert>
          <AlertTitle>Payment successful</AlertTitle>
          <AlertDescription>
            Your subscription should be active shortly. If it doesn’t update within a minute, refresh.
          </AlertDescription>
        </Alert>
      ) : null}

      {checkoutCanceled ? (
        <Alert>
          <AlertTitle>Checkout canceled</AlertTitle>
          <AlertDescription>No changes were made to your subscription.</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>
            {isPro ? "You have an active subscription." : "Pro is required to use the Calculator."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subscription status</span>
              <span className="font-medium">
                {user?.stripeSubscriptionStatus ?? (isPro ? "active" : "—")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current period end</span>
              <span className="font-medium">{formatDate(user?.stripeCurrentPeriodEnd)}</span>
            </div>

            {cancelScheduled ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cancellation</span>
                <span className="font-medium">Scheduled for period end</span>
              </div>
            ) : null}
          </div>

          {cancelScheduled ? (
            <Alert>
              <AlertTitle>Cancellation scheduled</AlertTitle>
              <AlertDescription>
                Your subscription will end at the end of the current billing period.
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-wrap items-center gap-2 p-6">
          {!isPro ? <UpgradeToProButton /> : <ManageSubscriptionButton />}

          {hasCustomer ? (
            <Button asChild variant="outline">
              <Link href="/cancel">Cancel subscription</Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
