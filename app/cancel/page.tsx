// app/cancel/page.tsx
import CancelRequestForm from "./ui";

export default function CancelPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Abo kündigen</h1>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        Kündigung Ihres Abonnements (gemäß § 312k BGB)
      </h2>
      <p className="mb-4">
        (Diese Seite ermöglicht Ihnen die Kündigung Ihres laufenden Abonnements ohne Login.)
      </p>

      <p className="mb-4">
        Geben Sie hier die E-Mail-Adresse ein, mit der Sie Ihr Abonnement abgeschlossen haben. Sie erhalten anschließend einen
        Bestätigungslink per E-Mail, um die Kündigung abzuschließen. Die Kündigung tritt mit Abschluss des laufenden Abrechnungszeitraums
        in Kraft, sofern nicht anders angegeben.
      </p>

      <p className="mb-4">
        <strong>Ohne Login kündigen:</strong> Diese Kündigungsfunktion steht allen Kunden offen, auch wenn Sie nicht eingeloggt sind. Sie
        benötigen lediglich Zugriff auf die E-Mail-Adresse, die bei der Anmeldung/Zahlung hinterlegt wurde.
      </p>

      <p className="mb-6">
        (Alternativ können Sie Ihr Abo auch jederzeit durch eine formlose Mitteilung an contact@trooptac.pro kündigen. Wir empfehlen jedoch
        die Online-Kündigung für eine sofortige Bestätigung.)
      </p>

      <CancelRequestForm />

      <hr className="my-10 border-slate-800" />

      <h2 className="text-lg font-semibold mt-6 mb-2">Cancel your subscription (English translation)</h2>
      <p className="mb-4">
        (Use this page to cancel your current subscription online, without needing to log in.)
      </p>

      <p className="mb-4">
        Please enter the email address associated with your subscription. You will receive a confirmation link via email to finalize the
        cancellation. Unless otherwise stated, the cancellation will take effect at the end of the current billing period.
      </p>

      <p className="mb-4">
        <strong>Cancel without login:</strong> This cancellation tool is available to all customers, even if you are not logged in. You only
        need access to the email address that was used for sign-up/payment.
      </p>

      <p className="mb-4">
        (As an alternative, you may cancel your subscription at any time by sending a simple email to contact@trooptac.pro. However, we
        recommend using the online cancellation above to receive an immediate confirmation.)
      </p>
    </main>
  );
}
