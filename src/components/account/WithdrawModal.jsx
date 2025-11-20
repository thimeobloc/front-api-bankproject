import React, { useState } from "react";
import Cookies from "js-cookie";

export default function WithdrawModal({ account, withdrawAmount, setWithdrawAmount, setShowWithdrawModal, fetchTransactions, refreshAccount }) {
  const [errorMessage, setErrorMessage] = useState("");

  // Fonction pour effectuer un retrait
  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide supérieur à 0.");
      return;
    }

    if (amount > account.balance) {
      setErrorMessage("Le montant dépasse le solde disponible.");
      return;
    }

    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/balances/withdraw", {
        method:"POST",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ user_id: account.user_id, account_id: account.id, amount })
      });

      if (!response.ok) {
        setErrorMessage("Erreur lors du retrait.");
        return;
      }

      await response.json();
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      setErrorMessage("");
      fetchTransactions();  // Mise à jour des transactions
      refreshAccount();     // Mise à jour du solde du compte
    } catch (e) {
      console.error(e);
      setErrorMessage("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Retrait</h2>
        <input
          type="number"
          value={withdrawAmount}
          onChange={e => setWithdrawAmount(e.target.value)}
          placeholder="Montant (€)"
          min="0"
        />
        {errorMessage && <p style={{ color: "red", marginTop: "8px" }}>{errorMessage}</p>}
        <div className="modal-actions">
          <button className="btn" onClick={() => { setShowWithdrawModal(false); setErrorMessage(""); }}>Annuler</button>
          <button className="btn" onClick={handleWithdraw}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}
