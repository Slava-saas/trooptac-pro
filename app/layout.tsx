import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { AppHeader } from "@/components/app-header";
import { FooterShell } from "@/components/footer-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
      <html lang="en" className={`dark ${inter.variable}`}>
        <body className="min-h-screen bg-background font-sans text-foreground antialiased">
          <div className="flex min-h-screen flex-col">
            <AppHeader />

            <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-24">
              {children}
            </div>

            <FooterShell />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
