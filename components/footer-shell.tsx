"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FooterShell() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TroopTac.pro
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">Legal</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Deutsch</DropdownMenuLabel>
            <DropdownMenuItem asChild><Link href="/impressum">Impressum</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/datenschutz">Datenschutz</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/widerruf">Widerruf</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/barrierefreiheit">Barrierefreiheit</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/cancel">Abo kündigen</Link></DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>English</DropdownMenuLabel>
            <DropdownMenuItem asChild><Link href="/legal">Legal Notice</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/privacy">Privacy Policy</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/withdrawal">Withdrawal</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/accessibility">Accessibility</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/cancel">Cancel Subscription</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </footer>
  );
}
