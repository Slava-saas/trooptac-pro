import type { Metadata } from "next";
import Link from "next/link";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "TroopTac.pro",
  description: "March-Calculator for PvP players",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-slate-950 text-slate-100">
          <header className="border-b border-slate-800">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="font-semibold">
                <Link href="/" className="hover:text-slate-200">
                  TroopTac.pro
                </Link>
              </div>

              <nav className="flex items-center gap-3">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>

          <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-slate-400 border-t border-slate-800">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <span className="font-semibold text-slate-300">Deutsch:</span>
              <Link className="hover:text-slate-200" href="/impressum">
                Impressum
              </Link>
              <Link className="hover:text-slate-200" href="/datenschutz">
                Datenschutz
              </Link>
              <Link className="hover:text-slate-200" href="/widerruf">
                Widerruf
              </Link>
              <Link className="hover:text-slate-200" href="/barrierefreiheit">
                Barrierefreiheit
              </Link>
              <Link className="hover:text-slate-200" href="/cancel">
                Abo kündigen
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <span className="font-semibold text-slate-300">English:</span>
              <Link className="hover:text-slate-200" href="/legal">
                Legal Notice
              </Link>
              <Link className="hover:text-slate-200" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="hover:text-slate-200" href="/withdrawal">
                Withdrawal
              </Link>
              <Link className="hover:text-slate-200" href="/accessibility">
                Accessibility
              </Link>
              <Link className="hover:text-slate-200" href="/cancel">
                Cancel Subscription
              </Link>
            </div>

            <div className="mt-6 text-[11px] leading-relaxed text-slate-500">
              © {new Date().getFullYear()} TroopTac.pro
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
