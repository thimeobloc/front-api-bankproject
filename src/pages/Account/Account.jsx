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

  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) setAccount(JSON.parse(savedAccount));
  }, []);

  const refreshAccount = async () => {
    if (!account) return;
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`http://localhost:8000/accounts/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAccount(data);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement :", error);
    }
  };

  useEffect(() => {
    if (!account) return;

    const fetchUser = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await fetch(`http://localhost:8000/users/${account.user_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUserName(data.name);
      } catch {
        setUserName("John Doe");
      }
    };

    fetchUser();
  }, [account]);

  const fetchTransactions = async () => {
    if (!account) return;
    try {
      const token = Cookies.get("access_token");

      const deposits = await (await fetch(`http://localhost:8000/balances/deposits/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })).json();

      const withdraws = await (await fetch(`http://localhost:8000/balances/withdraws/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })).json();

      let transfers = await (await fetch(`http://localhost:8000/balances/transfers`, {
        headers: { Authorization: `Bearer ${token}` }
      })).json();

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
          direction: t.from_account_id === account.id ? "Envoyé" : "Reçu"
        }))
      ];

      all.sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(all);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (account) fetchTransactions();
  }, [account]);

  useEffect(() => {
    if (filter === "Tous") setFilteredTransactions(transactions);
    else setFilteredTransactions(transactions.filter(t => t.type === filter));
  }, [filter, transactions]);

  if (!account) {
    return (
      <div className="account-page">
        <h2>Aucun compte sélectionné</h2>
        <button className="btn" onClick={() => navigate("/")}>Retour</button>
      </div>
    );
  }

  return (
    <section className="account-page two-columns">
      <AccountInfo
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
