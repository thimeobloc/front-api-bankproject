import React from "react";
import '../../../src/pages/Historique/Historique.css';

export default function AfficheModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Détails de la transaction</h2>

        <p><strong>Bénéficiaire :</strong> {transaction.label}</p>
        <p><strong>Date :</strong> {transaction.date}</p>
        <p><strong>Montant :</strong> {transaction.amount}</p>
        <p><strong>Catégorie :</strong> {transaction.category || "Générale"}</p>
        <p><strong>Description :</strong> Transaction effectuée sur votre compte.</p>
        <p><strong>IBAN :</strong> FR76 3000 4000 5000 6000 7000 800</p>

        <button className="modal-close-btn" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  );
}
