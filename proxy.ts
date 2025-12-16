import { clerkMiddleware } from "@clerk/nextjs/server";

type NetlifyEnv = { get?: (key: string) => string | undefined };
type NetlifyGlobal = { env?: NetlifyEnv };

const netlifyEnv = (globalThis as unknown as { Netlify?: NetlifyGlobal }).Netlify?.env;
const processEnv = typeof process !== "undefined" ? process.env : undefined;

function readEnv(key: string): string | undefined {
  return netlifyEnv?.get?.(key) ?? processEnv?.[key];
}

export default clerkMiddleware({
  secretKey: readEnv("CLERK_SECRET_KEY"),
  publishableKey: readEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
