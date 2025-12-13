// instrumentation-client.ts (browser-side)
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});

// Required for navigation instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
