import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";

export async function GET() {
  const err = new Error("TT-prod-sentry-test");
  Sentry.captureException(err);
  await Sentry.flush(2000);
  return new Response("sent", { status: 500 });
}
