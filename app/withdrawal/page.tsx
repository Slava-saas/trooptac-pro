export default function WithdrawalPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Right of Withdrawal</h1>

      <h2 className="text-lg font-semibold mt-6 mb-2">Right of Withdrawal (for digital services)</h2>

      <p className="mb-4">
        You have the right to withdraw from this contract within 14 days without giving any reason. The withdrawal period will expire after
        fourteen days from the day of the conclusion of the contract (subscription purchase).
      </p>

      <p className="mb-4">
        To exercise the right of withdrawal, you must inform us (Slava Maajoul, Am Pulverschuppen 15, 48155 Münster, Germany, Email:
        contact@trooptac.pro) of your decision to withdraw from this contract by an unequivocal statement (e.g. an email or letter sent to
        us). You may use the model withdrawal form below, but it is not obligatory. To meet the withdrawal deadline, it is sufficient for
        you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.
      </p>

      <p className="mb-4">
        <strong>Effects of withdrawal:</strong> If you withdraw from this contract, we shall reimburse you for all payments we have received
        from you, without undue delay and in any event not later than 14 days from the day on which we receive your notice of withdrawal. We
        will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless expressly agreed
        otherwise; in no case will you incur any fees as a result of the reimbursement.
      </p>

      <p className="mb-4">
        If you requested to begin the performance of services during the withdrawal period, you shall pay us a reasonable amount
        proportionate to what was provided until you communicated to us your withdrawal from this contract, in comparison with the full
        coverage of the contract.
      </p>

      <p className="mb-4">
        <strong>Expiry of the right of withdrawal:</strong> For digital content or services fully provided within the 14-day period (e.g.
        one-time downloads or completed online services), your right of withdrawal expires early if you have agreed that we may begin the
        performance before the end of the withdrawal period and you acknowledged that you will lose your right to withdraw once the service
        is fully performed (according to German Civil Code § 356 (5)). We will obtain this consent during the order process when applicable.
      </p>

      <p className="mb-6">– End of withdrawal instructions –</p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Model Withdrawal Form</h2>
      <p className="mb-4">(Complete and return this form only if you wish to withdraw from the contract.)</p>

      <div className="border border-slate-800 rounded p-4 whitespace-pre-wrap text-sm">
        {`To:
Slava Maajoul
Am Pulverschuppen 15
48155 Münster, Germany
Email: contact@trooptac.pro

I/We hereby give notice that I/we withdraw from my/our contract for using the TroopTac.pro service.

Subscribed on: [date]
Name of consumer(s): [your name]
Address of consumer(s): [your address]
Email of consumer: [your email address]
Date: [date of notification]

Signature: ______________________
(only if this form is notified on paper)

Please note: For ongoing subscription contracts that have already been partially fulfilled, you may be required to pay for the services used until the withdrawal (see above regarding pro-rata payment).

(This English translation is for convenience only. The German withdrawal instructions are legally binding.)`}
      </div>
    </main>
  );
}
