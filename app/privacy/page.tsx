export default function PrivacyPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-4 text-sm text-slate-400">
        (Informative English Translation. In case of any discrepancy, the German version prevails.)
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Controller / Responsible Entity</h2>
      <p className="mb-4">
        Slava Maajoul
        <br />
        Am Pulverschuppen 15, 48155 Münster, Germany
        <br />
        Email: privacy@trooptac.pro
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">General Principles</h2>
      <p className="mb-4">
        We process personal data exclusively in accordance with applicable laws (GDPR, German BDSG, TTDSG). In general, you can use
        TroopTac.pro without registration. Certain features (e.g., saving personal calculations) require you to create an account.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Registration and Authentication</h2>
      <p className="mb-2">Available login options:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Email and password (authentication via Clerk)</li>
        <li>Google Sign-In (OAuth2, provided by Google Ireland Ltd.)</li>
      </ul>
      <p className="mb-4">
        The authentication service is provided by Clerk Inc., 164 Townsend St., San Francisco, CA 94107, USA. We process the data for
        the purpose of user authentication (GDPR Art. 6(1)(b), performance of contract). Where data is transferred to the USA, this is
        safeguarded by EU Standard Contractual Clauses (SCCs).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Hosting and Data Storage</h2>
      <p className="mb-4">
        Our website is hosted by Netlify, Inc. (2325 3rd Street, Suite 296, San Francisco, CA 94107, USA). The database is operated by
        Neon Tech Inc. on servers located in the EU (Ireland region). We have Data Processing Agreements (Art. 28 GDPR) in place with
        these providers. User data is primarily stored in the EU where possible.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Payment Processing</h2>
      <p className="mb-4">
        Payments for any premium services are handled by Stripe Payments Europe Ltd., The One Building, 1 Lower Grand Canal Street,
        Dublin 2, Ireland. Stripe stores payment data only as long as required by law (e.g., 6–10 years for financial records). Legal
        basis for processing is Art. 6(1)(b) GDPR (contract fulfillment).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Communication via Email</h2>
      <p className="mb-4">
        If you contact us by email, your data will be used solely to respond to your inquiry. Please note that unencrypted emails may be
        read by third parties on the internet. After completing your request, we will delete your correspondence unless legal retention
        requirements apply. Transaction records (invoices, etc.) are stored according to statutory requirements (typically 6–10 years).
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Cookies</h2>
      <p className="mb-4">
        TroopTac.pro uses only technically necessary cookies (e.g., session cookies to maintain your login and security cookies). No
        tracking or advertising cookies are used. Therefore, we do not display a cookie consent banner. When using third-party logins
        (such as Google), those providers may set their own cookies according to their privacy policies.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">No Analytics</h2>
      <p className="mb-4">
        This platform does not use any analytics or tracking tools. We do not perform any user profiling or marketing analysis. Only
        minimal server logs are kept (e.g., page requests with timestamp and anonymized IP address) for security and debugging purposes.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Your Data Protection Rights</h2>
      <p className="mb-2">As a user, you have the following rights concerning your personal data:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Access – to know what data we have about you (GDPR Art. 15)</li>
        <li>Rectification – to correct inaccurate data (Art. 16)</li>
        <li>Erasure – to delete your data, “right to be forgotten” (Art. 17)</li>
        <li>Restriction – to restrict processing of your data (Art. 18)</li>
        <li>Data Portability – to receive your data in a portable format (Art. 20)</li>
        <li>Objection – to object to data processing (Art. 21) where our processing is based on legitimate interests</li>
      </ul>
      <p className="mb-4">
        To exercise these rights, simply contact us (e.g., via email to privacy@trooptac.pro). We will respond in accordance with legal
        requirements. You also have the right to lodge a complaint with a data protection supervisory authority if you believe we are
        violating data protection laws (GDPR Art. 77).
      </p>

      <p className="text-sm text-slate-400">
        (This English version is provided for convenience. For full details, please refer to the authoritative German text.)
      </p>
    </main>
  );
}
