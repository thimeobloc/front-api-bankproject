import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Account.css";
import Cookies from "js-cookie";

export default function Account() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [filter, setFilter] = useState("Tous");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showCloseModal, setShowCloseModal] = useState(false);

  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) setAccount(JSON.parse(savedAccount));
  }, []);

  useEffect(() => {
    if (account) fetchTransactions();
  }, [account]);

  useEffect(() => {
    if (filter === "Tous") setFilteredTransactions(transactions);
    else setFilteredTransactions(transactions.filter((tx) => tx.type === filter));
  }, [filter, transactions]);

  const fetchTransactions = async () => {
    try {
      const token = Cookies.get("access_token");

      const depositsRes = await fetch(`http://localhost:8000/balances/deposits/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deposits = await depositsRes.json();

      const withdrawsRes = await fetch(`http://localhost:8000/balances/withdraws/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const withdraws = await withdrawsRes.json();

      const transfersRes = await fetch(`http://localhost:8000/balances/transfers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let transfers = await transfersRes.json();
      transfers = transfers.filter(
        (t) => t.from_account_id === account.id || t.to_account_id === account.id
      );

      const allTransactions = [
        ...deposits.map((d) => ({ id: d.id, type: "Dépôt", amount: d.amount, date: d.date })),
        ...withdraws.map((w) => ({ id: w.id, type: "Retrait", amount: w.amount, date: w.date })),
        ...transfers.map((t) => ({
          id: t.id,
          type: "Transfert",
          amount: t.amount,
          date: t.date,
          direction: t.from_account_id === account.id ? "Envoyé" : "Reçu",
        })),
      ];

      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(allTransactions);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) return;
    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/balances/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: account.user_id, account_id: account.id, amount: Number(depositAmount) }),
      });
      if (!response.ok) return;
      const data = await response.json();
      setAccount({ ...account, balance: data.new_balance });
      setDepositAmount("");
      setShowDepositModal(false);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) return;
    try {
      const token = Cookies.get("access_token");
      const response = await fetch("http://localhost:8000/balances/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user_id: account.user_id, account_id: account.id, amount: Number(withdrawAmount) }),
      });
      if (!response.ok) return;
      const data = await response.json();
      setAccount({ ...account, balance: data.new_balance });
      setWithdrawAmount("");
      setShowWithdrawModal(false);
      fetchTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseAccount = async () => {
    try {
      const token = Cookies.get("access_token");
      const response = await fetch(`http://localhost:8000/accounts/close/${account.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      setAccount({ ...account, closed: true, balance: 0 });
      setShowCloseModal(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (!account) {
    return (
      <div className="account-page">
        <h2>Aucun compte sélectionné</h2>
        <button className="btn" onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    );
  }

  const filterOptions = ["Tous", "Dépôt", "Retrait", "Transfert"];

  return (
    <section className="account-page two-columns">
      <div className="account-info-column">
        <h1>Infos du compte</h1>
        <div className="account-info">
          <p><strong>Type :</strong> {account.type}</p>
          <p><strong>Solde :</strong> {account.balance.toFixed(2)} €</p>
          <p><strong>RIB :</strong> {account.rib}</p>
          <p><strong>Date de création :</strong> {new Date(account.date).toLocaleString()}</p>
          <p><strong>Statut :</strong> {account.closed ? "Fermé" : "Actif"}</p>
        </div>

        <div className="account-buttons">
          <button className="btn" onClick={() => navigate("/")}>Retour</button>
          {!account.closed && <button className="btn danger" onClick={() => setShowCloseModal(true)}>Clôturer</button>}
        </div>

        <div className="deposit-withdraw-buttons">
          <button className="btn" onClick={() => setShowDepositModal(true)}>Dépôt</button>
          <button className="btn" onClick={() => setShowWithdrawModal(true)}>Retrait</button>
        </div>
      </div>

      <div className="transactions-column">
        <h1>Historique des transactions</h1>
        <div className="transaction-filter-buttons">
          {filterOptions.map((option) => (
            <button
              key={option}
              className={`btn filter-btn ${filter === option ? "active" : ""}`}
              onClick={() => setFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Montant (€)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.type} {tx.direction ? `(${tx.direction})` : ""}</td>
                <td>{tx.amount.toFixed(2)}</td>
                <td>{new Date(tx.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dépôt */}
      {showDepositModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Dépôt</h2>
            <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="Montant (€)" />
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowDepositModal(false)}>Annuler</button>
              <button className="btn" onClick={handleDeposit}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Retrait */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Retrait</h2>
            <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Montant (€)" />
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowWithdrawModal(false)}>Annuler</button>
              <button className="btn" onClick={handleWithdraw}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Clôture */}
      {showCloseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Clôturer le compte</h2>
            <p>Le solde sera transféré au compte principal.</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setShowCloseModal(false)}>Annuler</button>
              <button className="btn danger" onClick={handleCloseAccount}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
