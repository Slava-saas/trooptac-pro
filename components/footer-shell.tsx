import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const linkCls = "text-sm text-muted-foreground hover:text-foreground";

export function FooterShell() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs text-muted-foreground">Legal (DE):</span>

          <Link className={linkCls} href="/impressum">Impressum</Link>
          <Link className={linkCls} href="/datenschutz">Datenschutz</Link>
          <Link className={linkCls} href="/widerruf">Widerruf</Link>

          <Link className="text-sm font-medium underline underline-offset-4 hover:text-foreground" href="/cancel">
            Verträge hier kündigen
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                Legal (more)
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link href="/barrierefreiheit">Barrierefreiheit</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/legal">Legal Notice (EN)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/privacy">Privacy Policy (EN)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/withdrawal">Withdrawal (EN)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/accessibility">Accessibility (EN)</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/cancel">Cancel Subscription (EN)</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} TroopTac.pro
        </div>
      </div>
    </footer>
  );
}
