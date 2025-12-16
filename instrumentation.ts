export async function register() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn,
      enabled: true,
      tracesSampleRate: 0.1,
    });
  }
}

export async function onRequestError(
  err: unknown,
  request: unknown,
  context: unknown
) {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  try {
    const Sentry: any = await import("@sentry/nextjs");

    if (typeof Sentry.captureRequestError === "function") {
      return await Sentry.captureRequestError(err, request, context);
    }

    if (typeof Sentry.captureException === "function") {
      Sentry.captureException(err);
    }
  } catch {
    // ignore
  }
}
