// app/dashboard/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm">
          <Link href="/dashboard/calculator" className="hover:text-sky-400">
            Calculator
          </Link>
          <Link href="/dashboard/history" className="hover:text-sky-400">
            History
          </Link>
          <Link href="/dashboard/settings" className="hover:text-sky-400">
            Settings
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
