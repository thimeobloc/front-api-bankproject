export default function Transaction() {
  const transactions = [
    { Date: "12/11/2000", Beneficiaries: "Antonin", Categorie: "Virement reçu", Solde:"500.00€" },
    { Date: "30/12/2025", Beneficiaries: "Lucas", Categorie: "Virement envoyé", Solde:"10.00€" },
    { Date: "25/01/2026", Beneficiaries: "Estelle", Categorie: "Virement reçu", Solde:"150.00€" }
  ];

  return (
    <div className="transaction-container">
      {transactions.map((t, index) => (
        <div key={index}>
          <div className="transaction-date">{t.Date}</div>
          <div className="transaction-item">
            <div className="transaction-left">
              <div className="transaction-beneficiary">{t.Beneficiaries}</div>
              <div className="transaction-category">{t.Categorie}</div>
            </div>
            <div className="transaction-saldo">{t.Solde}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
