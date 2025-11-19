import React, { useState } from "react";
import TransactionModal from "./TransactionModalSpec";

export default function Transaction() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = [
    { Date: "12/11/2000", Beneficiaries: "Antonin", Categorie: "Virement reçu", Solde:"500.00€" },
    { Date: "30/12/2025", Beneficiaries: "Lucas", Categorie: "Virement envoyé", Solde:"10.00€" },
    { Date: "25/01/2026", Beneficiaries: "Estelle", Categorie: "Virement reçu", Solde:"150.00€" }
  ];

  const openModal = (t) => {
    setSelectedTransaction(t);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <div className="transaction-container">
      {transactions.map((t, index) => (
        <div key={index}>
          <div className="transaction-date">{t.Date}</div>

          <div
            className="transaction-item"
            onClick={() => openModal(t)}
            style={{ cursor: "pointer" }}
          >
            <div className="transaction-left">
              <div className="transaction-beneficiary">{t.Beneficiaries}</div>
              <div className="transaction-category">{t.Categorie}</div>
            </div>
            <div className="transaction-saldo">{t.Solde}</div>
          </div>
        </div>
      ))}

      <TransactionModal
        transaction={selectedTransaction}
        onClose={closeModal}
      />
    </div>
  );
}
