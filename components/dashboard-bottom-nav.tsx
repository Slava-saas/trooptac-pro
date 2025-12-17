"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard/calculator", label: "Calculator" },
  { href: "/dashboard/history", label: "Plans" },
  { href: "/dashboard/settings", label: "Account" },
] as const;

export function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-2 py-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const active =
            pathname === it.href || pathname.startsWith(it.href + "/");

          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:text-foreground",
                active && "bg-accent text-foreground"
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
