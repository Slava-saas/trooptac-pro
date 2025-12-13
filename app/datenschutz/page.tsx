export default function DatenschutzPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

      <h2 className="text-lg font-semibold mt-6 mb-2">Verantwortliche Stelle</h2>
      <p className="mb-4">
        Slava Maajoul
        <br />
        Am Pulverschuppen 15, 48155 Münster, Deutschland
        <br />
        E-Mail: privacy@trooptac.pro
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Grundsätze der Datenverarbeitung</h2>
      <p className="mb-4">
        Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Vorgaben (DSGVO, BDSG, TTDSG).
        Die Nutzung von TroopTac.pro ist grundsätzlich ohne Anmeldung möglich. Bestimmte Funktionen (z.&nbsp;B. das Speichern
        persönlicher Berechnungen) erfordern jedoch eine Registrierung.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Registrierung und Authentifizierung</h2>
      <p className="mb-2">Für den Login stehen folgende Optionen zur Verfügung:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>E-Mail und Passwort (Anmeldung direkt über Clerk)</li>
        <li>Google-Login (OAuth2, Anbieter: Google Ireland Ltd., Dublin)</li>
      </ul>
      <p className="mb-4">
        Anbieter des Authentifizierungsdienstes ist Clerk Inc., 164 Townsend St., San Francisco, CA 94107, USA.
        Wir verarbeiten die Daten im Rahmen der Nutzer-Authentifizierung (Rechtsgrundlage Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO).
        Eine Übermittlung in die USA erfolgt – soweit erforderlich – auf Basis von EU Standardvertragsklauseln (SCCs).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Hosting und Datenhaltung</h2>
      <p className="mb-4">
        Unsere Website wird bei Netlify, Inc. (2325 3rd Street, Suite 296, San Francisco, CA 94107, USA) gehostet.
        Die Datenbank wird über Neon Tech Inc. (PostgreSQL-Server mit Standort EU – Region Irland) betrieben.
        Mit beiden Dienstleistern bestehen Auftragsverarbeitungsverträge nach Art.&nbsp;28 DSGVO. Eine Speicherung von Nutzerdaten
        erfolgt vorzugsweise in der EU.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Zahlungsabwicklung</h2>
      <p className="mb-4">
        Die Zahlungsabwicklung für kostenpflichtige Dienste erfolgt über Stripe Payments Europe Ltd., The One Building,
        1 Lower Grand Canal Street, Dublin 2, Irland. Dabei werden Zahlungsdaten ausschließlich im Rahmen der gesetzlichen
        Aufbewahrungspflichten gespeichert (z.&nbsp;B. 6–10 Jahre für steuerrelevante Daten). Rechtsgrundlage der Datenverarbeitung
        ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (Vertragserfüllung).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Kommunikation per E-Mail</h2>
      <p className="mb-4">
        Wenn Sie uns per E-Mail kontaktieren, werden Ihre Angaben nur zur Bearbeitung der Anfrage und für eventuelle Anschlussfragen
        verarbeitet. Die Kommunikation kann unverschlüsselt erfolgen. Nach Abschluss Ihrer Anfrage werden die Daten gelöscht, sofern
        keine gesetzlichen Aufbewahrungspflichten bestehen. Rechnungs- und Geschäftsvorgänge speichern wir gemäß den gesetzlichen
        Vorgaben (in der Regel 6–10 Jahre).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Einsatz von Cookies</h2>
      <p className="mb-4">
        Auf TroopTac.pro kommen ausschließlich technisch notwendige Cookies zum Einsatz (z.&nbsp;B. Session Cookies zur Aufrechterhaltung
        Ihrer Anmeldung und Sicherheits-Cookies). Keine dieser Cookies dient Tracking- oder Marketingzwecken. Daher ist kein Einwilligungs-
        Banner erforderlich. Beim Login über Drittanbieter (Google) können ggf. Cookies durch diese Anbieter gesetzt werden; dies unterliegt
        den Datenschutzbestimmungen des jeweiligen Drittanbieters.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Keine Analyse-Tools</h2>
      <p className="mb-4">
        Diese Plattform verzichtet auf Analytic-Tools oder Tracking-Dienste. Es findet keine Reichweitenmessung, Profiling oder Online-Werbe-
        Tracking statt. Serverseitig werden lediglich technisch notwendige Logs geführt (z.&nbsp;B. Aufruf der Seite, Zeitstempel, IP in
        anonymisierter Form), um die Sicherheit und Integrität des Dienstes zu gewährleisten.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Rechte der betroffenen Personen</h2>
      <p className="mb-2">Als Nutzer von TroopTac.pro haben Sie hinsichtlich Ihrer personenbezogenen Daten die folgenden Rechte:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Auskunft über Ihre bei uns gespeicherten Daten (Art.&nbsp;15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art.&nbsp;16 DSGVO)</li>
        <li>Löschung (Art.&nbsp;17 DSGVO) – Ihr Recht auf „Vergessenwerden“</li>
        <li>Einschränkung der Verarbeitung (Art.&nbsp;18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art.&nbsp;20 DSGVO) – Erhalt Ihrer Daten in einem gängigen Format</li>
        <li>
          Widerspruch gegen die Verarbeitung (Art.&nbsp;21 DSGVO) – soweit die Verarbeitung auf Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO beruht.
        </li>
      </ul>
      <p className="mb-4">
        Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung an uns (z.&nbsp;B. per E-Mail an privacy@trooptac.pro).
        Wir werden Ihre Anfrage zeitnah gemäß den gesetzlichen Vorgaben bearbeiten. Sie haben zudem das Recht, sich bei Beschwerden an eine
        Datenschutz-Aufsichtsbehörde zu wenden (Art.&nbsp;77 DSGVO).
      </p>

      <p className="text-sm text-slate-400">
        (Weitere Details zur Datenverarbeitung, die hier nicht explizit genannt sind, ergeben sich aus den Umständen der Nutzung.
        Wir verzichten auf nicht erforderliche Datenerhebungen.)
      </p>
    </main>
  );
}
