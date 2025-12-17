"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FooterShell() {
  const pathname = usePathname();

  // Dashboard hat bereits Bottom-Nav -> kein zusätzlicher Footer
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <span className="text-xs text-muted-foreground">Legal (DE):</span>

          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/impressum">
            Impressum
          </Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/datenschutz">
            Datenschutz
          </Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/widerruf">
            Widerruf
          </Link>
          <Link className="text-sm font-medium underline underline-offset-4 hover:text-foreground" href="/cancel">
            Verträge hier kündigen
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              Legal (more)
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/barrierefreiheit">Barrierefreiheit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/legal">Legal Notice (EN)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/privacy">Privacy Policy (EN)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/withdrawal">Withdrawal (EN)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/accessibility">Accessibility (EN)</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cancel">Cancel Subscription (EN)</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">© {new Date().getFullYear()} TroopTac.pro</div>
      </div>
    </footer>
  );
}
