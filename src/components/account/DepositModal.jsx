import React, { useState } from "react";
import Cookies from "js-cookie";

export default function DepositModal({ account, depositAmount, setDepositAmount, setShowDepositModal, fetchTransactions, refreshAccount }) {
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction pour effectuer un dépôt
  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide supérieur à 0.");
      return;
    }

    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/balances/deposit", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body:JSON.stringify({ user_id: account.user_id, account_id: account.id, amount })
      });

      if (!response.ok) {
        setErrorMessage("Erreur lors du dépôt.");
        return;
      }

      await response.json();
      setDepositAmount("");
      setShowDepositModal(false);
      setErrorMessage("");
      fetchTransactions();   // Mise à jour des transactions
      refreshAccount();      // Mise à jour du solde du compte
    } catch(e) {
      console.error(e);
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Dépôt</h2>
        <input
          type="number"
          value={depositAmount}
          onChange={e => setDepositAmount(e.target.value)}
          placeholder="Montant (€)"
          min="0"
        />
        {errorMessage && <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>}
        <div className="modal-actions">
          <button className="btn" onClick={() => { setShowDepositModal(false); setErrorMessage(""); }}>Annuler</button>
          <button className="btn" onClick={handleDeposit}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}
