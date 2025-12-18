import React from "react";
import '../../../src/pages/Historique/Historique.css';

/**
 * AfficheModal component.
 *
 * Displays the details of a selected transaction in a modal popup.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.transaction - Transaction object to display
 * @param {string} props.transaction.label - Beneficiary or transaction label
 * @param {string} props.transaction.date - Transaction date
 * @param {string|number} props.transaction.amount - Transaction amount
 * @param {string} [props.transaction.category] - Transaction category (optional)
 * @param {function} props.onClose - Callback function to close the modal
 */
export default function AfficheModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture du modal lors d'un clic à l'intérieur
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
