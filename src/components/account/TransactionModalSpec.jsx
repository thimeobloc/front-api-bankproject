import React from "react";
import '../../../src/pages/Account/Account.css';

export default function TransactionModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Détails de la transaction</h1>

        <p>Bénéficiaire : {transaction.Beneficiaries}</p>
        <p>Date : {transaction.Date}</p>
        <p>Montant : {transaction.Solde}</p>
        <p>Catégorie : {transaction.Categorie}</p>
        <p>Description : Transaction effectuée sur votre compte.</p>
        <p>IBAN : FR76 3000 4000 5000 6000 7000 800</p>

        <button className="modal-close-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
