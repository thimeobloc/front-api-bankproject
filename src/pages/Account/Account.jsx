import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import AccountInfo from "../../components/account/AccountInfo";
import TransactionsTable from "../../components/account/TransactionsTable";
import DepositModal from "../../components/account/DepositModal";
import WithdrawModal from "../../components/account/WithdrawModal";
import CloseAccountModal from "../../components/account/CloseAccountModal";

export default function Account() {
  const navigate = useNavigate();

  const [account, setAccount] = useState(null);
  const [userName, setUserName] = useState("");
  const [filter, setFilter] = useState("Tous");
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showCloseModal, setShowCloseModal] = useState(false);

  // Récupérer le compte sélectionné depuis le localStorage
  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) setAccount(JSON.parse(savedAccount));
  }, []);

  // Rafraîchir le compte depuis le serveur
  const refreshAccount = async () => {
    if (!account) return;
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`http://localhost:8000/accounts/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setAccount(data);
      localStorage.setItem("selectedAccount", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors du rafraîchissement :", error);
    }
  };

  // Récupérer le nom de l'utilisateur
  useEffect(() => {
    if (!account) return;

    const fetchUser = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await fetch(`http://localhost:8000/users/${account.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setUserName("John Doe");
          return;
        }
        const data = await res.json();
        setUserName(data.name);
      } catch {
        setUserName("John Doe");
      }
    };

    fetchUser();
  }, [account]);

  // Récupérer les transactions du compte
  const fetchTransactions = async () => {
    if (!account) return;
    try {
      const token = Cookies.get("access_token");

      const depositsRes = await fetch(`http://localhost:8000/balances/deposits/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deposits = (await depositsRes.json()) || [];

      const withdrawsRes = await fetch(`http://localhost:8000/balances/withdraws/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const withdraws = (await withdrawsRes.json()) || [];

      let transfersRes = await fetch(`http://localhost:8000/balances/transfers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let transfers = (await transfersRes.json()) || [];

      transfers = transfers.filter(
        t => t.from_account_id === account.id || t.to_account_id === account.id
      );

      const all = [
        ...deposits.map(d => ({ id: d.id, type: "Dépôt", amount: d.amount, date: d.date })),
        ...withdraws.map(w => ({ id: w.id, type: "Retrait", amount: w.amount, date: w.date })),
        ...transfers.map(t => ({
          id: t.id,
          type: "Transfert",
          amount: t.amount,
          date: t.date,
          direction: t.from_account_id === account.id ? "Envoyé" : "Reçu",
        })),
      ];

      all.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(all);
    } catch (err) {
      console.error(err);
      setTransactions([]);
    }
  };

  // Mettre à jour les transactions filtrées
  useEffect(() => {
    if (filter === "Tous") setFilteredTransactions(transactions);
    else setFilteredTransactions(transactions.filter(t => t.type === filter));
  }, [filter, transactions]);

  // Charger les transactions à chaque changement de compte
  useEffect(() => {
    if (account) fetchTransactions();
  }, [account]);

  if (!account) {
    return (
      <div className="account-page">
        <h2>Aucun compte sélectionné</h2>
        <button className="btn" onClick={() => navigate("/")}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <section className="account-page two-columns">
      <AccountInfo
        key={account.id + account.balance}
        account={account}
        userName={userName}
        transactions={transactions}
        setShowDepositModal={setShowDepositModal}
        setShowWithdrawModal={setShowWithdrawModal}
        setShowCloseModal={setShowCloseModal}
      />

      <TransactionsTable
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        filter={filter}
        setFilter={setFilter}
      />

      {showDepositModal && (
        <DepositModal
          account={account}
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
          setShowDepositModal={setShowDepositModal}
          fetchTransactions={fetchTransactions}
          refreshAccount={refreshAccount}
        />
      )}

      {showWithdrawModal && (
        <WithdrawModal
          account={account}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          setShowWithdrawModal={setShowWithdrawModal}
          fetchTransactions={fetchTransactions}
          refreshAccount={refreshAccount}
        />
      )}

      {showCloseModal && (
        <CloseAccountModal
          account={account}
          setAccount={setAccount}
          setShowCloseModal={setShowCloseModal}
          refreshAccount={refreshAccount}
        />
      )}
    </section>
  );
}
