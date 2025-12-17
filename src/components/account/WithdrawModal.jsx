import React, { useState } from "react";
import Cookies from "js-cookie";

export default function WithdrawModal({
  account,
  withdrawAmount,
  setWithdrawAmount,
  setShowWithdrawModal,
  fetchTransactions,
  refreshAccount
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) {
      setErrorMessage("Veuillez saisir un montant valide.");
      return;
    }

    if (amount > account.balance) {
      setErrorMessage("Montant supérieur au solde.");
      return;
    }

    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/balances/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
        <h2>Retrait</h2>
        <input
          type="number"
          value={withdrawAmount}
          onChange={e => setWithdrawAmount(e.target.value)}
          placeholder="Montant (€)"
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div className="modal-actions">
          <button className="btn" onClick={() => setShowWithdrawModal(false)}>Annuler</button>
          <button className="btn" onClick={handleWithdraw}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

WithdrawModal.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,

  withdrawAmount: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  setWithdrawAmount: PropTypes.func.isRequired,
  setShowWithdrawModal: PropTypes.func.isRequired,
  fetchTransactions: PropTypes.func.isRequired,
  refreshAccount: PropTypes.func.isRequired,
};
