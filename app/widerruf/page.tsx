export default function WiderrufPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Widerruf</h1>

      <h2 className="text-lg font-semibold mt-6 mb-2">Widerrufsbelehrung (für digitale Dienstleistungen)</h2>

      <p className="mb-4">
        Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage
        ab dem Tag des Vertragsschlusses (Abschluss des Abonnements).
      </p>

      <p className="mb-4">
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Slava Maajoul, Am Pulverschuppen 15, 48155 Münster, E-Mail: contact@trooptac.pro)
        mittels einer eindeutigen Erklärung (z.&nbsp;B. ein per E-Mail versandter Brief) über Ihren Entschluss, diesen Vertrag zu widerrufen,
        informieren. Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist. Zur Wahrung
        der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
      </p>

      <p className="mb-4">
        <strong>Folgen des Widerrufs:</strong> Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten
        haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns
        eingegangen ist. Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt
        haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart. Ihnen werden keinesfalls Entgelte wegen dieser Rückzahlung
        berechnet.
      </p>

      <p className="mb-4">
        Haben Sie verlangt, dass die Dienstleistung (z.&nbsp;B. der Zugang zu digitalen Inhalten) während der Widerrufsfrist beginnen soll, so
        haben Sie uns einen angemessenen Betrag zu zahlen. Dieser Betrag entspricht dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von
        der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Leistungen im Vergleich zum
        Gesamtumfang der vertraglich vorgesehenen Leistungen.
      </p>

      <p className="mb-4">
        <strong>Erlöschen des Widerrufsrechts:</strong> Bei vollständig erbrachten digitalen Leistungen (z.&nbsp;B. einmalige Downloads oder
        abgeschlossene Online-Leistungen), die nicht auf einem körperlichen Datenträger geliefert werden, erlischt Ihr Widerrufsrecht
        vorzeitig, wenn Sie zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und Sie Ihre
        Kenntnis bestätigt haben, dass Sie durch diese Zustimmung mit Beginn der Ausführung Ihr Widerrufsrecht verlieren (§&nbsp;356
        Abs.&nbsp;5 BGB). Wir holen diese Zustimmung im Bestellprozess ein, sofern relevant.
      </p>

      <p className="mb-6">– Ende der Widerrufsbelehrung –</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Muster-Widerrufsformular</h2>
      <p className="mb-4">
        (Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen und uns zusenden.)
      </p>

      <div className="border border-slate-800 rounded p-4 whitespace-pre-wrap text-sm">
        {`An:
Slava Maajoul
Am Pulverschuppen 15
48155 Münster, Deutschland
E-Mail: contact@trooptac.pro

Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über die Nutzung der Dienstleistung TroopTac.pro.

Abonniert am: [Datum]
Name des Verbrauchers: [Ihr Name]
Anschrift des Verbrauchers: [Ihre Anschrift]
E-Mail des Verbrauchers: [Ihre E-Mail-Adresse]
Datum: [Datum der Widerrufserklärung]

Unterschrift: ______________________
(nur erforderlich bei Mitteilung auf Papier)

Bitte beachten: Für laufende Abonnement-Verträge, die bereits teilweise erfüllt wurden, kann gegebenenfalls Wertersatz für die bis zum Widerruf erbrachte Leistung verlangt werden (siehe oben).`}
      </div>
    </main>
  );
}
