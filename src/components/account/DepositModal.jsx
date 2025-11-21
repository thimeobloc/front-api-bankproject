import React, { useState } from "react";
import Cookies from "js-cookie";

export default function DepositModal({
  account,
  depositAmount,
  setDepositAmount,
  setShowDepositModal,
  fetchTransactions,
  refreshAccount,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide supérieur à 0.");
      return;
    }

    try {
      const token = Cookies.get("access_token");
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

      if (!response.ok) {
        const errData = await response.json();
        setErrorMessage(errData.detail || "Erreur lors du dépôt.");
        return;
      }

      await response.json();
      setDepositAmount("");
      setShowDepositModal(false);
      setErrorMessage("");

      // 🔹 Recharger transactions et compte
      await fetchTransactions();
      await refreshAccount();
    } catch (err) {
      console.error(err);
      setErrorMessage("Erreur réseau.");
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
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div className="modal-actions">
          <button className="btn" onClick={() => setShowDepositModal(false)}>Annuler</button>
          <button className="btn" onClick={handleDeposit}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}
