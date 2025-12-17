import React, { useState } from "react";
import Cookies from "js-cookie";

export default function DepositModal({
  account,             // Objet compte sur lequel effectuer le dépôt
  depositAmount,       // Montant saisi par l'utilisateur
  setDepositAmount,    // Fonction pour mettre à jour le montant
  setShowDepositModal, // Fonction pour ouvrir/fermer le modal
  fetchTransactions,   // Fonction pour recharger les transactions après le dépôt
  refreshAccount,      // Fonction pour actualiser le solde du compte après le dépôt
}) {
  // État local pour stocker un éventuel message d'erreur
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction déclenchée au clic sur "Confirmer"
  const handleDeposit = async () => {
    const amount = Number(depositAmount); // Conversion de la saisie en nombre

    // Vérification du montant : doit être > 0
    if (!amount || amount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide supérieur à 0.");
      return; // On arrête la fonction si le montant est invalide
    }

    try {
      // Récupération du token JWT depuis les cookies pour l'authentification
      const token = Cookies.get("access_token");

      // Requête POST vers l'API pour effectuer le dépôt
      const response = await fetch("http://localhost:8000/balances/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: Number(account.user_id),
          account_id: Number(account.id),
          amount,
        }),
      });

      // Gestion des erreurs côté serveur
      if (!response.ok) {
        const errData = await response.json();
        setErrorMessage(errData.detail || "Erreur lors du dépôt.");
        return;
      }

      // Succès : on vide le champ, ferme le modal et réinitialise le message d'erreur
      await response.json();
      setDepositAmount("");
      setShowDepositModal(false);
      setErrorMessage("");

      // Mise à jour des données côté front : transactions et solde
      await fetchTransactions();
      await refreshAccount();
    } catch (err) {
      // Gestion des erreurs réseau ou inattendues
      console.error(err);
      setErrorMessage("Erreur réseau.");
    }
  };

  return (
    <div className="modal-overlay"> {/* Overlay couvrant tout l'écran */}
      <div className="modal-content"> {/* Contenu principal du modal */}
        <h2>Dépôt</h2>

        {/* Input pour le montant du dépôt */}
        <input
          type="number"
          value={depositAmount}
          onChange={e => setDepositAmount(e.target.value)} // Mise à jour du montant saisi
          placeholder="Montant (€)"
        />

        {/* Affichage d'un message d'erreur si nécessaire */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Actions disponibles dans le modal */}
        <div className="modal-actions">
          <button className="btn" onClick={() => setShowDepositModal(false)}>Annuler</button>
          <button className="btn" onClick={handleDeposit}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

DepositModal.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
  }).isRequired,

  depositAmount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  setDepositAmount: PropTypes.func.isRequired,
  setShowDepositModal: PropTypes.func.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
  refreshAccount: PropTypes.func.isRequired,
};
