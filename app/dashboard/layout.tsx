// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: "/dashboard" });
  }

  return <>{children}</>;
}
