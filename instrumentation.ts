// instrumentation.ts (server-side)
import * as Sentry from "@sentry/nextjs";

export async function register() {
  // Nur Node runtime instrumentieren (Netlify Edge bewusst auslassen)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      enabled: !!process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
    });
  }
}

// Required to capture request errors in App Router
export const onRequestError = Sentry.captureRequestError;
