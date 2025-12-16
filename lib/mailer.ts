// lib/mailer.ts
import "server-only";
import { Resend } from "resend";

function mustGetEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

const apiKey = mustGetEnv("RESEND_API_KEY");
const from = mustGetEnv("RESEND_FROM");

const resend = new Resend(apiKey);

type Locale = "de" | "en";

export async function sendCancelConfirmEmail(opts: {
  to: string;
  confirmUrl: string;
  locale?: Locale;
}) {
  const locale: Locale = opts.locale ?? "de";

  const subject =
    locale === "de"
      ? "Bitte bestätige deine Kündigung"
      : "Please confirm your cancellation";

  const text =
    locale === "de"
      ? `Bitte klicke zur Bestätigung deiner Kündigung auf folgenden Link:\n\n${opts.confirmUrl}\n\nWenn du das nicht warst, ignoriere diese E-Mail.`
      : `Please click the link below to confirm your cancellation:\n\n${opts.confirmUrl}\n\nIf this wasn't you, you can ignore this email.`;

  const { data, error } = await resend.emails.send({
    from,
    to: opts.to,
    subject,
    text,
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return data;
}
