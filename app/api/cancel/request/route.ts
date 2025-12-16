// app/api/cancel/request/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendCancelConfirmEmail } from "@/lib/mailer";
import crypto from "crypto";

export const runtime = "nodejs";

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const emailRaw = body?.email;

    if (typeof emailRaw !== "string" || emailRaw.trim().length === 0) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    const email = normalizeEmail(emailRaw);
    if (email.length > 254 || !email.includes("@")) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    // Best-effort IP (Netlify/Proxy)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;

    const emailHash = sha256Hex(email);
    const ipHash = ip ? sha256Hex(ip) : null;

    // Request speichern (Audit + rudimentäres Rate-Limit später möglich)
    const row = await prisma.cancelRequest.create({
      data: { email, emailHash, ipHash },
      select: { id: true, createdAt: true },
    });

    // Base URL robust aus der Request ableiten (dev / deploy-preview / production)
    const origin = new URL(req.url).origin;

    // Token: row.id + emailHash (damit confirm endpoint email nicht im Klartext braucht)
    const token = `${row.id}.${emailHash}`;
    const confirmUrl = `${origin}/cancel/confirm?token=${encodeURIComponent(token)}`;

    await sendCancelConfirmEmail({ to: email, confirmUrl, locale: "de" });

    // Immer 200, kein Email-Existence-Leak
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[cancel/request] error", err);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
