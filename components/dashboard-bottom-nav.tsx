"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { href: "/dashboard/calculator", label: "Calculator" },
  { href: "/dashboard/history", label: "Plans" },
  { href: "/dashboard/settings", label: "Account" },
] as const;

export function DashboardBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-2 py-2 pb-[env(safe-area-inset-bottom)]">
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

        <DropdownMenu>
          <DropdownMenuTrigger className="flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
            Legal
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/cancel">Verträge kündigen</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/impressum">Impressum</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/datenschutz">Datenschutz</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/widerruf">Widerruf</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/barrierefreiheit">Barrierefreiheit</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
