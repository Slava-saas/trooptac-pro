export function getBaseUrl(req: Request): string {
  const envUrl = (
    process.env.DEPLOY_PRIME_URL ||
    process.env.URL ||
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).replace(/\/+$/, "");

  const protoRaw = req.headers.get("x-forwarded-proto") || "https";
  const proto = protoRaw.split(",")[0].trim();

  const hostRaw =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    "";

  const host = hostRaw.split(",")[0].trim();
  const derived = host ? `${proto}://${host}`.replace(/\/+$/, "") : "";

  const isTrusted =
    host === "trooptac.pro" ||
    host === "www.trooptac.pro" ||
    host === "localhost:3000" ||
    host.endsWith(".netlify.app");

  if (derived && isTrusted) return derived;
  if (envUrl) return envUrl;

  throw new Error("Unable to determine base URL");
}
