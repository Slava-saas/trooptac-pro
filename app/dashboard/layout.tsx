// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/dashboard" });
  }

  return (
    <div className="pb-20">
      {children}
      <DashboardBottomNav />
    </div>
  );
}
