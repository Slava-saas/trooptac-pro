import type { Metadata } from "next";
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
              <div className="font-semibold">TroopTac.pro</div>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
